import { NextRequest, NextResponse } from 'next/server';
import { openPipelineContext } from '../_lib';
import { listResources } from '../../../../../pipeline/src/db/sqlite';
import { CurationStatus } from '../../../../../pipeline/src/shared/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { db } = openPipelineContext();

  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || undefined;
    const level = searchParams.get('level') || undefined;
    const status = (searchParams.get('status') || undefined) as CurationStatus | undefined;
    const limit = Number(searchParams.get('limit') || '100');

    const resources = listResources(db, {
      subject,
      level,
      curationStatus: status,
      limit,
    });

    return NextResponse.json({ total: resources.length, resources }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    db.close();
  }
}
