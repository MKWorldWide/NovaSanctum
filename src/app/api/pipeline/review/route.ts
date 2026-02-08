import { NextRequest, NextResponse } from 'next/server';
import { openPipelineContext } from '../_lib';
import { updateResourceReview } from '../../../../../pipeline/src/db/sqlite';
import { CurationStatus } from '../../../../../pipeline/src/shared/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { db } = openPipelineContext();

  try {
    const body = await request.json().catch(() => ({}));
    const id = typeof body.id === 'string' ? body.id : '';
    const reviewer = typeof body.reviewer === 'string' ? body.reviewer : '';
    const status = body.status as CurationStatus;
    const notes = typeof body.notes === 'string' ? body.notes : undefined;

    if (!id || !reviewer) {
      return NextResponse.json({ error: 'id and reviewer are required' }, { status: 400 });
    }
    if (status !== 'reviewed' && status !== 'rejected') {
      return NextResponse.json({ error: 'status must be reviewed or rejected' }, { status: 400 });
    }

    const resource = updateResourceReview(db, {
      id,
      reviewer,
      status,
      notes,
    });

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ resource }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    db.close();
  }
}
