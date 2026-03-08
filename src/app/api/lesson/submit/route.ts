import { NextRequest } from 'next/server';
import { apiLogger } from '../../_shared/logger';
import {
  enforceRateLimit,
  enforceSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
} from '../../_shared/security';
import { assertNumber, assertString } from '../../_shared/validation';
import {
  addLessonAttempt,
  getCourseRun,
  getLearnerProfile,
  getMasteryStates,
  getReviewCards,
  listLessonAttempts,
  setReviewCards,
  upsertMasteryStates,
} from '@/services/learning/store';
import {
  buildReviewCards,
  computeAttemptScore,
  deriveAdaptiveRecommendation,
  updateMasteryForLesson,
} from '@/services/learning/mastery';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    enforceRateLimit(request, 'lesson-submit');
    enforceSameOrigin(request);

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const profileId = assertString(body.profileId, 'profileId', { min: 4, max: 64 });
    const courseRunId = assertString(body.courseRunId, 'courseRunId', { min: 4, max: 64 });
    const moduleId = assertString(body.moduleId, 'moduleId', { min: 2, max: 140 });
    const lessonId = assertString(body.lessonId, 'lessonId', { min: 2, max: 180 });
    const chunkId = assertString(body.chunkId, 'chunkId', { min: 2, max: 180 });
    const confidence = assertNumber(body.confidence, 'confidence', { min: 0, max: 1 });
    const answers = Array.isArray(body.answers)
      ? body.answers
          .map(item => {
            const entry = item as Record<string, unknown>;
            return {
              prompt: assertString(entry.prompt, 'answers.prompt', { min: 1, max: 240 }),
              answer: assertString(entry.answer, 'answers.answer', { min: 1, max: 1000 }),
              correct: typeof entry.correct === 'boolean' ? entry.correct : undefined,
            };
          })
          .slice(0, 30)
      : [];

    const profile = getLearnerProfile(profileId);
    if (!profile) {
      return jsonError('Profile not found.', 404);
    }

    const courseRun = getCourseRun(courseRunId);
    if (!courseRun || courseRun.profileId !== profileId) {
      return jsonError('Course run not found for this profile.', 404);
    }

    const modulePlan = courseRun.adaptiveBlueprint.modules.find(item => item.moduleId === moduleId);
    const chunk = modulePlan?.chunks.find(
      item => item.chunkId === chunkId && item.lessonId === lessonId
    );
    if (!modulePlan || !chunk) {
      return jsonError('Lesson chunk not found.', 404);
    }

    const score = computeAttemptScore(answers, confidence);
    const attempt = {
      lessonId,
      chunkId,
      answers,
      confidence,
      score,
      submittedAt: new Date().toISOString(),
    };
    addLessonAttempt(profileId, attempt);

    const existingMastery = getMasteryStates(profileId);
    const masteryUpdates = updateMasteryForLesson({
      existing: existingMastery,
      courseRun,
      moduleId,
      lessonId,
      score,
    });
    const masterySnapshot = upsertMasteryStates(profileId, masteryUpdates);

    const generatedReviewCards = buildReviewCards({
      attempt,
      moduleId,
      objectives: chunk.objectives,
    });
    const existingReviewCards = getReviewCards(profileId);
    if (generatedReviewCards.length > 0) {
      setReviewCards(profileId, [...existingReviewCards, ...generatedReviewCards].slice(-200));
    }

    const priorAttemptsForModule = listLessonAttempts(profileId).filter(item =>
      item.chunkId.startsWith(`${moduleId}:`)
    );
    const recommendation = deriveAdaptiveRecommendation({
      score,
      priorAttemptsForModule,
    });

    return jsonOk({
      score: Number((score * 100).toFixed(1)),
      scoreNormalized: Number(score.toFixed(3)),
      masteryUpdated: masteryUpdates.length,
      masterySnapshot,
      reviewCardsAdded: generatedReviewCards.length,
      nextRecommendation: recommendation,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    apiLogger.error('lesson/submit failed', { message });
    return jsonError(message, 400);
  }
}
