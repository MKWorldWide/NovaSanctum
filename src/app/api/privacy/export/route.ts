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
import { exportLearnerData } from '@/services/learning/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    enforceRateLimit(request, 'privacy-export');
    enforceSameOrigin(request);

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const profileId = assertString(body.profileId, 'profileId', { min: 4, max: 64 });
    const exported = exportLearnerData(profileId);
    if (!exported) {
      return jsonError('Profile not found.', 404);
    }

    return jsonOk({
      profileId,
      exportedAt: new Date().toISOString(),
      data: exported,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    apiLogger.error('privacy/export failed', { message });
    return jsonError(message, 400);
  }
}
