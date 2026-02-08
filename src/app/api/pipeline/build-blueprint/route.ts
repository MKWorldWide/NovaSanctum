import { NextRequest, NextResponse } from 'next/server';
import { openPipelineContext } from '../_lib';
import { discoverAndOptionallyIngest } from '../../../../../pipeline/src/pipeline';
import { buildCourseBlueprint } from '../../../../../pipeline/src/blueprint/generator';
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
    const seedIngest = Number(body.seedIngest || 0);

    if (!subject) {
      return NextResponse.json({ error: 'Missing subject' }, { status: 400 });
    }

    if (seedIngest > 0) {
      await discoverAndOptionallyIngest(
        db,
        config,
        {
          subject,
          level,
          targetOutcomes: outcomes,
          maxResults: Math.max(seedIngest, 20),
        },
        seedIngest
      );
    }

    const result = buildCourseBlueprint(db, {
      subject,
      level,
      outcomes,
      outputDir: config.storage.blueprintDir,
    });

    return NextResponse.json(
      {
        blueprintId: result.blueprint.id,
        moduleCount: result.blueprint.modules.length,
        jsonPath: result.jsonPath,
        markdownPath: result.markdownPath,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    db.close();
  }
}
