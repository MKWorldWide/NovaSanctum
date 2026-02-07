export type CrossrefWork = {
  title?: string[];
  author?: { given?: string; family?: string }[];
  issued?: { 'date-parts'?: number[][] };
  created?: { 'date-time'?: string };
  DOI?: string;
  URL?: string;
  'container-title'?: string[];
};

export type ScholarlyItem = {
  title: string;
  url?: string;
  doi?: string;
  authors?: string[];
  year?: number;
  venue?: string;
  source: 'crossref';
};

export async function crossrefSearch(query: string, limit = 10): Promise<ScholarlyItem[]> {
  const params = new URLSearchParams({ query, rows: String(Math.min(Math.max(limit, 1), 20)) });
  const res = await fetch(`https://api.crossref.org/works?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const json = await res.json();
  const items: CrossrefWork[] = json?.message?.items || [];
  return items.map((w): ScholarlyItem => {
    const year =
      w.issued?.['date-parts']?.[0]?.[0] ||
      (w.created?.['date-time'] ? new Date(w.created['date-time']).getFullYear() : undefined);
    const authors = (w.author || [])
      .map(a => [a.given, a.family].filter(Boolean).join(' '))
      .filter(Boolean);
    return {
      title: (w.title && w.title[0]) || 'Untitled',
      url: w.URL,
      doi: w.DOI,
      authors,
      year,
      venue: (w['container-title'] && w['container-title'][0]) || undefined,
      source: 'crossref',
    };
  });
}
