import { CourseBlueprint, Level } from '../../../pipeline/src/shared/types';

export type ReadingDepth = 'light' | 'standard' | 'deep';
export type ExplanationStyle = 'short' | 'detailed' | 'example-first';
export type ChunkMode = 'micro' | 'standard' | 'deep';
export type DifficultyLevel = 'supportive' | 'balanced' | 'challenging';

export interface LearningPreferences {
  sessionMinutes: number;
  readingDepth: ReadingDepth;
  explanationStyle: ExplanationStyle;
  confidenceLevel: number;
  accessibility: string[];
}

export interface LearnerProfile {
  profileId: string;
  audience: 'adult-self-learner' | 'student' | 'workforce';
  goals: string[];
  telemetryOptIn: boolean;
  privacyAcknowledged: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: LearningPreferences;
}

export interface MasteryState {
  objectiveKey: string;
  moduleId: string;
  score: number;
  updatedAt: string;
}

export interface ReviewCard {
  cardId: string;
  lessonId: string;
  objective: string;
  dueAt: string;
  confidence: number;
}

export interface LessonAttempt {
  lessonId: string;
  chunkId: string;
  answers: Array<{ prompt: string; answer: string; correct?: boolean }>;
  confidence: number;
  score: number;
  submittedAt: string;
}

export interface AdaptiveLessonChunk {
  chunkId: string;
  moduleId: string;
  lessonId: string;
  title: string;
  chunkMode: ChunkMode;
  targetMinutes: number;
  difficultyLevel: DifficultyLevel;
  adaptationReason: string;
  objectives: string[];
  practiceSpecs: string[];
  masteryCheckSpecs: string[];
  sourceMap: Array<{ section: string; resourceIds: string[] }>;
  recommendedResourceIds: string[];
}

export interface AdaptiveModulePlan {
  moduleId: string;
  title: string;
  chunkMode: ChunkMode;
  targetMinutes: number;
  difficultyLevel: DifficultyLevel;
  nextLessonReason: string;
  chunks: AdaptiveLessonChunk[];
}

export interface StudyPlan {
  dailyMinutes: number;
  sessionsPerWeek: number;
  estimatedWeeks: number;
}

export interface AdaptiveBlueprint {
  blueprintId: string;
  subject: string;
  level: Level;
  generatedAt: string;
  chunkMode: ChunkMode;
  targetMinutes: number;
  difficultyLevel: DifficultyLevel;
  prerequisites: string[];
  outcomes: string[];
  resourceIds: string[];
  modules: AdaptiveModulePlan[];
}

export interface CourseRun {
  courseRunId: string;
  profileId: string;
  subject: string;
  level: Level;
  goals: string[];
  createdAt: string;
  adaptiveBlueprint: AdaptiveBlueprint;
  studyPlan: StudyPlan;
}

export interface LearnerInitPayload {
  audience: LearnerProfile['audience'];
  goals: string[];
  telemetryOptIn: boolean;
  privacyAcknowledged: boolean;
  preferences: LearningPreferences;
}

export interface LearningPlanRequest {
  profileId: string;
  subject: string;
  level: Level;
  goals: string[];
}

export interface CitationValidationResult {
  valid: boolean;
  missingSections: string[];
  invalidResourceIds: string[];
}

export type BlueprintAdapterInput = {
  blueprint: CourseBlueprint;
  profile: LearnerProfile;
  masteryStates: MasteryState[];
};
