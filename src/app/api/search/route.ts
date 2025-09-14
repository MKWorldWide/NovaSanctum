import { NextRequest, NextResponse } from 'next/server';
import { federatedSearch } from '@/services/search/ResearchFederator';

type SearchResult = {
  query: string;
  timestamp: string;
  facilities: any[];
  publications: any[];
  patents: any[];
  institutes: any[];
  laboratories: any[];
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

    const agg = await federatedSearch(query, { includeWeb, trustedOnly, limitWeb: 10 });
    const result: SearchResult = {
      query,
      timestamp: new Date().toISOString(),
      facilities: agg.facilities,
      publications: agg.publications,
      patents: agg.patents,
      institutes: agg.institutes,
      laboratories: agg.laboratories,
      web: agg.web,
    };
    // Attach scholarly results for advanced clients (not typed on purpose)
    (result as any).scholarly = agg?.scholarly;

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
