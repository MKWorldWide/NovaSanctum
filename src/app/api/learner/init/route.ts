import { NextRequest } from 'next/server';
import { assertFeatureEnabled, getFeatureFlags } from '../../_shared/featureFlags';
import { apiLogger } from '../../_shared/logger';
import {
  enforceRateLimit,
  enforceSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
} from '../../_shared/security';
import { createLearnerProfile } from '@/services/learning/store';
import { parseLearnerInitPayload } from '../_schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const flags = getFeatureFlags();
    assertFeatureEnabled(flags.adaptiveLearning, 'Adaptive learning is currently disabled.');
    enforceRateLimit(request, 'learner-init');
    enforceSameOrigin(request);

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const payload = parseLearnerInitPayload(body);

    if (!payload.privacyAcknowledged) {
      return jsonError('privacyAcknowledged must be true to initialize a profile.', 400);
    }

    const profile = createLearnerProfile(payload);

    return jsonOk({
      profileId: profile.profileId,
      profile,
      recommendedStarter: {
        subject: 'Money Management & Credit Wisdom',
        level: 'high-school',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    apiLogger.error('learner/init failed', { message });
    return jsonError(message, 400);
  }
}
