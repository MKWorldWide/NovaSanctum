import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  CourseRun,
  LearnerInitPayload,
  LearnerProfile,
  LessonAttempt,
  MasteryState,
  ReviewCard,
} from './types';

type LearnerStoreState = {
  profiles: Record<string, LearnerProfile>;
  courseRuns: Record<string, CourseRun>;
  mastery: Record<string, MasteryState[]>;
  attempts: Record<string, LessonAttempt[]>;
  reviews: Record<string, ReviewCard[]>;
};

const STORE_DIR = path.resolve(process.cwd(), 'pipeline/data/learner');
const STORE_PATH = path.resolve(STORE_DIR, 'learner-store.json');

function ensureStoreDir(): void {
  fs.mkdirSync(STORE_DIR, { recursive: true });
}

function defaultState(): LearnerStoreState {
  return {
    profiles: {},
    courseRuns: {},
    mastery: {},
    attempts: {},
    reviews: {},
  };
}

function readState(): LearnerStoreState {
  ensureStoreDir();
  if (!fs.existsSync(STORE_PATH)) {
    return defaultState();
  }

  const raw = fs.readFileSync(STORE_PATH, 'utf8');
  if (!raw.trim()) {
    return defaultState();
  }

  try {
    return JSON.parse(raw) as LearnerStoreState;
  } catch {
    return defaultState();
  }
}

function writeState(state: LearnerStoreState): void {
  ensureStoreDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

export function createLearnerProfile(payload: LearnerInitPayload): LearnerProfile {
  const state = readState();
  const profileId = `lp_${crypto.randomBytes(8).toString('hex')}`;
  const timestamp = new Date().toISOString();

  const profile: LearnerProfile = {
    profileId,
    audience: payload.audience,
    goals: payload.goals,
    telemetryOptIn: payload.telemetryOptIn,
    privacyAcknowledged: payload.privacyAcknowledged,
    preferences: payload.preferences,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  state.profiles[profileId] = profile;
  state.mastery[profileId] = [];
  state.attempts[profileId] = [];
  state.reviews[profileId] = [];
  writeState(state);
  return profile;
}

export function getLearnerProfile(profileId: string): LearnerProfile | null {
  const state = readState();
  return state.profiles[profileId] || null;
}

export function saveCourseRun(courseRun: CourseRun): void {
  const state = readState();
  state.courseRuns[courseRun.courseRunId] = courseRun;
  writeState(state);
}

export function listCourseRunsByProfile(profileId: string): CourseRun[] {
  const state = readState();
  return Object.values(state.courseRuns)
    .filter(item => item.profileId === profileId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getCourseRun(courseRunId: string): CourseRun | null {
  const state = readState();
  return state.courseRuns[courseRunId] || null;
}

export function getMasteryStates(profileId: string): MasteryState[] {
  const state = readState();
  return state.mastery[profileId] || [];
}

export function upsertMasteryStates(profileId: string, updates: MasteryState[]): MasteryState[] {
  const state = readState();
  const existing = state.mastery[profileId] || [];
  const byKey = new Map(existing.map(item => [`${item.moduleId}:${item.objectiveKey}`, item]));

  for (const update of updates) {
    byKey.set(`${update.moduleId}:${update.objectiveKey}`, update);
  }

  const next = Array.from(byKey.values());
  state.mastery[profileId] = next;
  writeState(state);
  return next;
}

export function addLessonAttempt(profileId: string, attempt: LessonAttempt): void {
  const state = readState();
  const attempts = state.attempts[profileId] || [];
  attempts.push(attempt);
  state.attempts[profileId] = attempts.slice(-300);
  writeState(state);
}

export function listLessonAttempts(profileId: string): LessonAttempt[] {
  const state = readState();
  return state.attempts[profileId] || [];
}

export function setReviewCards(profileId: string, cards: ReviewCard[]): void {
  const state = readState();
  state.reviews[profileId] = cards;
  writeState(state);
}

export function getReviewCards(profileId: string): ReviewCard[] {
  const state = readState();
  return state.reviews[profileId] || [];
}

export function exportLearnerData(profileId: string): Record<string, unknown> | null {
  const state = readState();
  const profile = state.profiles[profileId];
  if (!profile) return null;

  return {
    profile,
    courseRuns: listCourseRunsByProfile(profileId),
    mastery: state.mastery[profileId] || [],
    attempts: state.attempts[profileId] || [],
    reviews: state.reviews[profileId] || [],
  };
}

export function deleteLearnerData(profileId: string): boolean {
  const state = readState();
  if (!state.profiles[profileId]) return false;

  delete state.profiles[profileId];
  delete state.mastery[profileId];
  delete state.attempts[profileId];
  delete state.reviews[profileId];

  for (const [courseRunId, courseRun] of Object.entries(state.courseRuns)) {
    if (courseRun.profileId === profileId) {
      delete state.courseRuns[courseRunId];
    }
  }

  writeState(state);
  return true;
}

export function resetLearnerHistory(profileId: string): boolean {
  const state = readState();
  if (!state.profiles[profileId]) return false;

  state.mastery[profileId] = [];
  state.attempts[profileId] = [];
  state.reviews[profileId] = [];

  for (const [courseRunId, courseRun] of Object.entries(state.courseRuns)) {
    if (courseRun.profileId === profileId) {
      delete state.courseRuns[courseRunId];
    }
  }

  state.profiles[profileId] = {
    ...state.profiles[profileId],
    updatedAt: new Date().toISOString(),
  };

  writeState(state);
  return true;
}
