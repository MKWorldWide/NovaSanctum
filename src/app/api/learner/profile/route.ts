import { NextRequest } from 'next/server';
import { apiLogger } from '../../_shared/logger';
import { enforceRateLimit, jsonError, jsonOk } from '../../_shared/security';
import { assertString } from '../../_shared/validation';
import {
  getLearnerProfile,
  getMasteryStates,
  getReviewCards,
  listCourseRunsByProfile,
} from '@/services/learning/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    enforceRateLimit(request, 'learner-profile');
    const { searchParams } = new URL(request.url);
    const profileId = assertString(searchParams.get('profileId'), 'profileId', { min: 4, max: 64 });
    const profile = getLearnerProfile(profileId);

    if (!profile) {
      return jsonError('Profile not found.', 404);
    }

    return jsonOk({
      profile,
      mastery: getMasteryStates(profileId),
      reviewQueue: getReviewCards(profileId),
      courseRuns: listCourseRunsByProfile(profileId),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    apiLogger.error('learner/profile failed', { message });
    return jsonError(message, 400);
  }
}
