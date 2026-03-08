import crypto from 'node:crypto';
import { CourseRun, LessonAttempt, MasteryState, ReviewCard } from './types';

export function computeAttemptScore(
  answers: Array<{ prompt: string; answer: string; correct?: boolean }>,
  confidence: number
): number {
  if (answers.length === 0) {
    return Math.min(Math.max(confidence, 0), 1);
  }

  const graded = answers.filter(item => typeof item.correct === 'boolean');
  if (graded.length === 0) {
    return Math.min(Math.max(0.4 + confidence * 0.6, 0), 1);
  }

  const correct = graded.filter(item => item.correct).length;
  return Math.min(Math.max(correct / graded.length, 0), 1);
}

export function updateMasteryForLesson(params: {
  existing: MasteryState[];
  courseRun: CourseRun;
  moduleId: string;
  lessonId: string;
  score: number;
}): MasteryState[] {
  const modulePlan = params.courseRun.adaptiveBlueprint.modules.find(
    item => item.moduleId === params.moduleId
  );
  const chunk = modulePlan?.chunks.find(item => item.lessonId === params.lessonId);
  if (!modulePlan || !chunk) return [];

  const now = new Date().toISOString();
  const byKey = new Map(
    params.existing.map(item => [`${item.moduleId}:${item.objectiveKey}`, item])
  );
  const updates: MasteryState[] = [];

  for (const objective of chunk.objectives) {
    const key = `${params.moduleId}:${objective}`;
    const previous = byKey.get(key);
    const blendedScore = previous
      ? Number((previous.score * 0.6 + params.score * 0.4).toFixed(3))
      : params.score;

    updates.push({
      objectiveKey: objective,
      moduleId: params.moduleId,
      score: blendedScore,
      updatedAt: now,
    });
  }

  return updates;
}

export function buildReviewCards(params: {
  attempt: LessonAttempt;
  moduleId: string;
  objectives: string[];
}): ReviewCard[] {
  const needsReview = params.attempt.score < 0.7 || params.attempt.confidence < 0.7;
  if (!needsReview) return [];

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);
  return params.objectives.map(objective => ({
    cardId: `rc_${crypto.randomBytes(8).toString('hex')}`,
    lessonId: params.attempt.lessonId,
    objective,
    dueAt: dueDate.toISOString(),
    confidence: params.attempt.confidence,
  }));
}

export function deriveAdaptiveRecommendation(params: {
  score: number;
  priorAttemptsForModule: LessonAttempt[];
}): {
  paceAction: 'slow down' | 'keep pace' | 'speed up';
  explanationStyle: 'short' | 'detailed' | 'example-first';
  reason: string;
} {
  if (params.score < 0.7) {
    return {
      paceAction: 'slow down',
      explanationStyle: 'example-first',
      reason: 'Recent score fell below 70%, so pacing is reduced and examples are emphasized.',
    };
  }

  const latestStrong = params.priorAttemptsForModule
    .slice(-2)
    .filter(item => item.score >= 0.9).length;
  if (params.score >= 0.9 && latestStrong >= 1) {
    return {
      paceAction: 'speed up',
      explanationStyle: 'short',
      reason: 'Two strong attempts indicate readiness for faster progression.',
    };
  }

  return {
    paceAction: 'keep pace',
    explanationStyle: 'detailed',
    reason: 'Performance is stable; continue with balanced pacing.',
  };
}
