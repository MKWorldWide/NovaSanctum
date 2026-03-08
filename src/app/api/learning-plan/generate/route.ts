import { NextRequest } from 'next/server';
import { openPipelineContext } from '../../pipeline/_lib';
import { buildCourseBlueprint } from '../../../../../pipeline/src/blueprint/generator';
import { Level } from '../../../../../pipeline/src/shared/types';
import { assertFeatureEnabled, getFeatureFlags } from '../../_shared/featureFlags';
import { apiLogger } from '../../_shared/logger';
import {
  enforceRateLimit,
  enforceSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
} from '../../_shared/security';
import { assertEnum, assertString, assertStringArray } from '../../_shared/validation';
import { createAdaptiveBlueprint, createCourseRun } from '@/services/learning/adaptivePlanner';
import { getLearnerProfile, getMasteryStates, saveCourseRun } from '@/services/learning/store';

const LEVELS = ['middle-school', 'high-school', 'undergrad', 'grad'] as const;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { db, config } = openPipelineContext();

  try {
    const flags = getFeatureFlags();
    assertFeatureEnabled(flags.adaptiveLearning, 'Adaptive learning is currently disabled.');
    enforceRateLimit(request, 'learning-plan-generate');
    enforceSameOrigin(request);

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const profileId = assertString(body.profileId, 'profileId', { min: 4, max: 64 });
    const subject = assertString(body.subject, 'subject', { min: 3, max: 180 });
    const level = assertEnum(body.level, 'level', LEVELS) as Level;
    const goals = assertStringArray(body.goals, 'goals', {
      minItems: 1,
      maxItems: 8,
      itemMin: 2,
      itemMax: 140,
    });

    const profile = getLearnerProfile(profileId);
    if (!profile) {
      return jsonError('Profile not found.', 404);
    }

    const blueprintResult = buildCourseBlueprint(db, {
      subject,
      level,
      outcomes: goals,
      outputDir: config.storage.blueprintDir,
    });

    const adaptiveBlueprint = createAdaptiveBlueprint({
      blueprint: blueprintResult.blueprint,
      profile,
      masteryStates: getMasteryStates(profileId),
    });

    const courseRun = createCourseRun({
      profileId,
      subject,
      level,
      goals,
      adaptiveBlueprint,
    });
    saveCourseRun(courseRun);

    return jsonOk({
      courseRunId: courseRun.courseRunId,
      adaptiveBlueprint: courseRun.adaptiveBlueprint,
      studyPlan: courseRun.studyPlan,
      generatedArtifacts: {
        markdownPath: blueprintResult.markdownPath,
        jsonPath: blueprintResult.jsonPath,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    apiLogger.error('learning-plan/generate failed', { message });
    return jsonError(message, 400);
  } finally {
    db.close();
  }
}
