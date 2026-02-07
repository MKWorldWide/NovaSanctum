import { NextRequest, NextResponse } from 'next/server';
import { federatedSearch } from '@/services/search/ResearchFederator';

type SearchResult = {
  query: string;
  timestamp: string;
  total: number;
  resources: {
    id: string;
    title: string;
    kind: 'article' | 'preprint' | 'medical' | 'reference';
    source: string;
    url?: string;
    summary?: string;
    authors?: string[];
    year?: number;
    venue?: string;
    access: 'open';
    domain?: string;
    level?: 'entry' | 'intermediate' | 'advanced';
    license?: string;
    curationStatus: 'automated-discovery' | 'reviewed';
  }[];
  sourceBreakdown: Record<string, number>;
  web?: { title: string; url: string; snippet?: string; source?: string }[];
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawQuery: unknown = body?.query;
    const includeWeb = Boolean(body?.includeWeb ?? true);
    const trustedOnly = Boolean(body?.trustedOnly ?? true);
    const query = typeof rawQuery === 'string' ? rawQuery.trim() : '';

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const agg = await federatedSearch(query, {
      includeWeb,
      trustedOnly,
      limitWeb: 10,
      limitScholarly: 12,
    });
    const result: SearchResult = {
      query,
      timestamp: new Date().toISOString(),
      total: agg.resources.length,
      resources: agg.resources,
      sourceBreakdown: agg.sourceBreakdown,
      web: agg.web,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
