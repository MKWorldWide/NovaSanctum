import crypto from 'node:crypto';
import { CourseBlueprint } from '../../../pipeline/src/shared/types';
import {
  AdaptiveBlueprint,
  AdaptiveLessonChunk,
  BlueprintAdapterInput,
  ChunkMode,
  CourseRun,
  DifficultyLevel,
  MasteryState,
  StudyPlan,
} from './types';

function averageMastery(states: MasteryState[]): number {
  if (states.length === 0) return 0.75;
  const sum = states.reduce((acc, item) => acc + item.score, 0);
  return sum / states.length;
}

function deriveChunkMode(
  preferredMinutes: number,
  masteryScore: number,
  confidenceLevel: number
): ChunkMode {
  if (preferredMinutes <= 10 || masteryScore < 0.7 || confidenceLevel < 0.55) {
    return 'micro';
  }
  if (preferredMinutes >= 28 && masteryScore > 0.9 && confidenceLevel > 0.75) {
    return 'deep';
  }
  return 'standard';
}

function targetMinutesForMode(mode: ChunkMode, preferredMinutes: number): number {
  if (mode === 'micro') return Math.min(Math.max(preferredMinutes, 6), 12);
  if (mode === 'deep') return Math.min(Math.max(preferredMinutes, 25), 40);
  return Math.min(Math.max(preferredMinutes, 15), 25);
}

function deriveDifficulty(masteryScore: number): DifficultyLevel {
  if (masteryScore < 0.7) return 'supportive';
  if (masteryScore >= 0.9) return 'challenging';
  return 'balanced';
}

function adaptationReason(mode: ChunkMode, masteryScore: number): string {
  if (mode === 'micro') {
    return `Pacing reduced for reinforcement (recent mastery ${Math.round(masteryScore * 100)}%).`;
  }
  if (mode === 'deep') {
    return `Pacing increased due to strong momentum (recent mastery ${Math.round(masteryScore * 100)}%).`;
  }
  return `Balanced pacing selected (recent mastery ${Math.round(masteryScore * 100)}%).`;
}

function buildChunks(
  blueprint: CourseBlueprint,
  mode: ChunkMode,
  difficulty: DifficultyLevel,
  targetMinutes: number,
  reason: string
): AdaptiveBlueprint['modules'] {
  return blueprint.modules.map(module => {
    const chunks: AdaptiveLessonChunk[] = module.lessons.map(lesson => ({
      chunkId: `${module.moduleId}:${lesson.lessonId}:${mode}`,
      moduleId: module.moduleId,
      lessonId: lesson.lessonId,
      title: lesson.title,
      chunkMode: mode,
      targetMinutes,
      difficultyLevel: difficulty,
      adaptationReason: reason,
      objectives: lesson.objectives,
      practiceSpecs: lesson.practiceSpecs,
      masteryCheckSpecs: lesson.masteryCheckSpecs,
      sourceMap: lesson.sourceMap,
      recommendedResourceIds: lesson.recommendedResourceIds,
    }));

    if (mode === 'micro') {
      chunks.push({
        chunkId: `${module.moduleId}:remediation:${mode}`,
        moduleId: module.moduleId,
        lessonId: `${module.moduleId}-remediation`,
        title: `${module.title} - Targeted Reinforcement`,
        chunkMode: mode,
        targetMinutes: Math.max(8, targetMinutes - 2),
        difficultyLevel: 'supportive',
        adaptationReason: 'Remediation chunk added to reduce overload and build confidence.',
        objectives: module.objectives.slice(0, 2),
        practiceSpecs: ['Short recall drill', 'Worked example replay'],
        masteryCheckSpecs: ['1 quick confidence check', '1 focused correction prompt'],
        sourceMap: [{ section: 'Remediation summary', resourceIds: module.citationResourceIds }],
        recommendedResourceIds: module.citationResourceIds,
      });
    }

    return {
      moduleId: module.moduleId,
      title: module.title,
      chunkMode: mode,
      targetMinutes,
      difficultyLevel: difficulty,
      nextLessonReason: reason,
      chunks,
    };
  });
}

export function createAdaptiveBlueprint(input: BlueprintAdapterInput): AdaptiveBlueprint {
  const mastery = averageMastery(input.masteryStates);
  const mode = deriveChunkMode(
    input.profile.preferences.sessionMinutes,
    mastery,
    input.profile.preferences.confidenceLevel
  );
  const targetMinutes = targetMinutesForMode(mode, input.profile.preferences.sessionMinutes);
  const difficulty = deriveDifficulty(mastery);
  const reason = adaptationReason(mode, mastery);

  return {
    blueprintId: `${input.blueprint.id}-${mode}`,
    subject: input.blueprint.subject,
    level: input.blueprint.level,
    generatedAt: new Date().toISOString(),
    chunkMode: mode,
    targetMinutes,
    difficultyLevel: difficulty,
    prerequisites: input.blueprint.prerequisites,
    outcomes: input.blueprint.outcomes,
    resourceIds: input.blueprint.resourceIds,
    modules: buildChunks(input.blueprint, mode, difficulty, targetMinutes, reason),
  };
}

export function createStudyPlan(blueprint: AdaptiveBlueprint): StudyPlan {
  const chunkCount = blueprint.modules.reduce((acc, module) => acc + module.chunks.length, 0);
  const totalMinutes = chunkCount * blueprint.targetMinutes;
  const dailyMinutes = Math.min(Math.max(blueprint.targetMinutes, 15), 45);
  const sessionsPerWeek = Math.min(Math.max(Math.round(210 / dailyMinutes), 3), 7);
  const weeklyMinutes = dailyMinutes * sessionsPerWeek;
  const estimatedWeeks = Math.max(1, Math.ceil(totalMinutes / weeklyMinutes));

  return {
    dailyMinutes,
    sessionsPerWeek,
    estimatedWeeks,
  };
}

export function createCourseRun(params: {
  profileId: string;
  subject: string;
  level: CourseRun['level'];
  goals: string[];
  adaptiveBlueprint: AdaptiveBlueprint;
}): CourseRun {
  return {
    courseRunId: `cr_${crypto.randomBytes(8).toString('hex')}`,
    profileId: params.profileId,
    subject: params.subject,
    level: params.level,
    goals: params.goals,
    createdAt: new Date().toISOString(),
    adaptiveBlueprint: params.adaptiveBlueprint,
    studyPlan: createStudyPlan(params.adaptiveBlueprint),
  };
}
