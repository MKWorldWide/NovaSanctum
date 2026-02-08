import { NextRequest, NextResponse } from 'next/server';
import { openPipelineContext } from '../_lib';
import { discoverAndOptionallyIngest } from '../../../../../pipeline/src/pipeline';
import { Level } from '../../../../../pipeline/src/shared/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { config, db } = openPipelineContext();

  try {
    const body = await request.json().catch(() => ({}));
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const level = (typeof body.level === 'string' ? body.level : 'high-school') as Level;
    const outcomes = Array.isArray(body.outcomes)
      ? body.outcomes.filter((item: unknown) => typeof item === 'string')
      : [];
    const maxResults = Number(body.maxResults || 20);
    const ingestTop = Number(body.ingestTop || 0);

    if (!subject) {
      return NextResponse.json({ error: 'Missing subject' }, { status: 400 });
    }

    const result = await discoverAndOptionallyIngest(
      db,
      config,
      {
        subject,
        level,
        targetOutcomes: outcomes,
        maxResults,
      },
      ingestTop
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    db.close();
  }
}
