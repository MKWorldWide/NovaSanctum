import { assertBoolean, assertEnum, assertNumber, assertStringArray } from '../_shared/validation';
import { LearnerInitPayload } from '@/services/learning/types';

const AUDIENCE_CHOICES = ['adult-self-learner', 'student', 'workforce'] as const;
const READING_DEPTH_CHOICES = ['light', 'standard', 'deep'] as const;
const EXPLANATION_STYLE_CHOICES = ['short', 'detailed', 'example-first'] as const;

export function parseLearnerInitPayload(body: Record<string, unknown>): LearnerInitPayload {
  const preferencesRaw = (body.preferences || {}) as Record<string, unknown>;
  return {
    audience: assertEnum(body.audience, 'audience', AUDIENCE_CHOICES),
    goals: assertStringArray(body.goals, 'goals', {
      minItems: 1,
      maxItems: 8,
      itemMin: 2,
      itemMax: 140,
    }),
    telemetryOptIn: assertBoolean(body.telemetryOptIn, 'telemetryOptIn'),
    privacyAcknowledged: assertBoolean(body.privacyAcknowledged, 'privacyAcknowledged'),
    preferences: {
      sessionMinutes: assertNumber(preferencesRaw.sessionMinutes, 'preferences.sessionMinutes', {
        integer: true,
        min: 5,
        max: 90,
      }),
      readingDepth: assertEnum(
        preferencesRaw.readingDepth,
        'preferences.readingDepth',
        READING_DEPTH_CHOICES
      ),
      explanationStyle: assertEnum(
        preferencesRaw.explanationStyle,
        'preferences.explanationStyle',
        EXPLANATION_STYLE_CHOICES
      ),
      confidenceLevel: assertNumber(preferencesRaw.confidenceLevel, 'preferences.confidenceLevel', {
        min: 0,
        max: 1,
      }),
      accessibility: assertStringArray(
        preferencesRaw.accessibility || [],
        'preferences.accessibility',
        {
          maxItems: 10,
          itemMin: 2,
          itemMax: 80,
        }
      ),
    },
  };
}
