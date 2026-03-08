import { NextRequest } from 'next/server';
import { apiLogger } from '../../_shared/logger';
import {
  enforceRateLimit,
  enforceSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
} from '../../_shared/security';
import { assertString } from '../../_shared/validation';
import { resetLearnerHistory } from '@/services/learning/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    enforceRateLimit(request, 'privacy-reset');
    enforceSameOrigin(request);

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const profileId = assertString(body.profileId, 'profileId', { min: 4, max: 64 });
    const reset = resetLearnerHistory(profileId);
    if (!reset) {
      return jsonError('Profile not found.', 404);
    }

    return jsonOk({
      profileId,
      reset: true,
      message: 'Learning history was reset while preserving profile preferences.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    apiLogger.error('privacy/reset failed', { message });
    return jsonError(message, 400);
  }
}
