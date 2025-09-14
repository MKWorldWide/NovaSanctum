export type S2Item = {
  title: string;
  url?: string;
  year?: number;
  venue?: string;
  authors?: { name: string }[];
};

export async function semanticScholarSearch(query: string, limit = 10): Promise<S2Item[]> {
  const params = new URLSearchParams({
    query,
    limit: String(Math.min(Math.max(limit, 1), 20)),
    fields: 'title,url,year,venue,authors',
  });
  const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const json = await res.json();
  const data = json?.data || [];
  return data.map((p: any) => ({
    title: p.title,
    url: p.url,
    year: p.year,
    venue: p.venue,
    authors: (p.authors || []).map((a: any) => ({ name: a.name })),
  }));
}

