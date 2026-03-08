import { NextRequest } from 'next/server';
import { getGenerationProvider } from '../../../../../pipeline/src/generation/interface';
import { CourseBlueprint, ModuleSpec } from '../../../../../pipeline/src/shared/types';
import { assertFeatureEnabled, getFeatureFlags } from '../../_shared/featureFlags';
import { apiLogger } from '../../_shared/logger';
import {
  enforceRateLimit,
  enforceSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
} from '../../_shared/security';
import { assertBoolean, assertString } from '../../_shared/validation';
import { validateCitationMap } from '@/services/learning/citation';
import { getCourseRun, getLearnerProfile } from '@/services/learning/store';
import { sanitizeMarkdown } from '@/services/learning/sanitize';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function toBlueprint(
  courseRun: ReturnType<typeof getCourseRun>,
  moduleId: string
): CourseBlueprint {
  if (!courseRun) {
    throw new Error('Course run not found.');
  }

  const modulePlan = courseRun.adaptiveBlueprint.modules.find(item => item.moduleId === moduleId);
  if (!modulePlan) {
    throw new Error('Module not found in course run.');
  }

  const lessons = modulePlan.chunks.map(chunk => ({
    lessonId: chunk.lessonId,
    title: chunk.title,
    objectives: chunk.objectives,
    recommendedResourceIds: chunk.recommendedResourceIds,
    practiceSpecs: chunk.practiceSpecs,
    masteryCheckSpecs: chunk.masteryCheckSpecs,
    sourceMap: chunk.sourceMap,
  }));

  const moduleSpec: ModuleSpec = {
    moduleId: modulePlan.moduleId,
    title: modulePlan.title,
    prerequisites: [],
    objectives: modulePlan.chunks.flatMap(item => item.objectives).slice(0, 6),
    lessons,
    projectSpecs: [],
    citationResourceIds: Array.from(
      new Set(modulePlan.chunks.flatMap(item => item.recommendedResourceIds))
    ),
  };

  return {
    id: `${courseRun.courseRunId}-runtime-blueprint`,
    subject: courseRun.subject,
    level: courseRun.level,
    outcomes: courseRun.goals,
    prerequisites: courseRun.adaptiveBlueprint.prerequisites,
    modules: [moduleSpec],
    resourceIds: moduleSpec.citationResourceIds,
    generatedAt: new Date().toISOString(),
    mode: 'manual',
  };
}

export async function POST(request: NextRequest) {
  try {
    const flags = getFeatureFlags();
    enforceRateLimit(request, 'lesson-generate');
    enforceSameOrigin(request);

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const profileId = assertString(body.profileId, 'profileId', { min: 4, max: 64 });
    const courseRunId = assertString(body.courseRunId, 'courseRunId', { min: 4, max: 64 });
    const moduleId = assertString(body.moduleId, 'moduleId', { min: 2, max: 140 });
    const chunkId = assertString(body.chunkId, 'chunkId', { min: 2, max: 180 });
    const byoApiKey =
      typeof body.byoApiKey === 'string' && body.byoApiKey.trim().length > 0
        ? body.byoApiKey.trim()
        : undefined;
    const rememberOnDevice =
      body.rememberOnDevice === undefined
        ? false
        : assertBoolean(body.rememberOnDevice, 'rememberOnDevice');

    if (rememberOnDevice) {
      return jsonError(
        'rememberOnDevice is not supported server-side; keys are session-only.',
        400
      );
    }

    const profile = getLearnerProfile(profileId);
    if (!profile) {
      return jsonError('Profile not found.', 404);
    }

    const courseRun = getCourseRun(courseRunId);
    if (!courseRun || courseRun.profileId !== profile.profileId) {
      return jsonError('Course run not found for this profile.', 404);
    }

    const modulePlan = courseRun.adaptiveBlueprint.modules.find(item => item.moduleId === moduleId);
    const chunk = modulePlan?.chunks.find(item => item.chunkId === chunkId);
    if (!modulePlan || !chunk) {
      return jsonError('Chunk not found in course run.', 404);
    }

    const blueprint = toBlueprint(courseRun, moduleId);
    const mode = byoApiKey ? 'byo-key' : 'manual';
    if (mode === 'byo-key') {
      assertFeatureEnabled(flags.byoGeneration, 'BYO generation is currently disabled.');
    }

    let provider = getGenerationProvider(mode);
    let draft = (
      await provider.generateLesson({
        blueprint,
        moduleId,
        mode,
        apiKey: byoApiKey,
      })
    ).find(item => item.lessonId === chunk.lessonId);

    let fallbackReason: string | undefined;
    if (!draft) {
      throw new Error(`No draft generated for lesson ${chunk.lessonId}.`);
    }

    const validation = validateCitationMap(
      draft.sourceMap,
      modulePlan.chunks.flatMap(item => item.recommendedResourceIds)
    );
    if (!validation.valid) {
      if (mode === 'byo-key') {
        fallbackReason = `BYO generation blocked by citation validation (missing sections: ${validation.missingSections.join(', ') || 'none'}; invalid IDs: ${validation.invalidResourceIds.join(', ') || 'none'}).`;
        provider = getGenerationProvider('manual');
        draft = (
          await provider.generateLesson({
            blueprint,
            moduleId,
            mode: 'manual',
          })
        ).find(item => item.lessonId === chunk.lessonId);
      } else {
        return jsonError('Manual lesson draft failed citation validation unexpectedly.', 500);
      }
    }

    if (!draft) {
      return jsonError('Failed to produce lesson draft.', 500);
    }

    return jsonOk({
      lessonId: draft.lessonId,
      moduleId: draft.moduleId,
      title: draft.title,
      bodyMarkdown: sanitizeMarkdown(draft.bodyMarkdown),
      quizDraft: draft.quizDraft,
      sourceMap: draft.sourceMap,
      citations: draft.citations,
      modeUsed: fallbackReason ? 'manual-fallback' : mode,
      whyThisLesson:
        chunk.adaptationReason ||
        `Selected ${courseRun.adaptiveBlueprint.chunkMode} chunk pacing for your learning profile.`,
      fallbackReason,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    apiLogger.error('lesson/generate failed', { message });
    return jsonError(message, 400);
  }
}
