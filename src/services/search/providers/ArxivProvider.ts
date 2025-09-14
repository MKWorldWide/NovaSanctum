export type ArxivItem = {
  id: string;
  title: string;
  summary?: string;
  authors?: string[];
  published?: string;
  url?: string;
};

export async function arxivSearch(query: string, limit = 10): Promise<ArxivItem[]> {
  const search = encodeURIComponent(`all:${query}`);
  const max = Math.min(Math.max(limit, 1), 20);
  const url = `https://export.arxiv.org/api/query?search_query=${search}&start=0&max_results=${max}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const xml = await res.text();
  // Very light parsing sufficient for title/id/summary/authors/published
  const entries = xml.split('<entry>').slice(1).map(e => '<entry>' + e);
  return entries.map(e => {
    const grab = (tag: string) => {
      const m = e.match(new RegExp(`<${tag}[^>]*>([\s\S]*?)</${tag}>`));
      return m ? m[1].replace(/\s+/g, ' ').trim() : undefined;
    };
    const id = grab('id') || '';
    const title = grab('title') || 'Untitled';
    const summary = grab('summary') || undefined;
    const published = grab('published') || undefined;
    const authors = Array.from(e.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g)).map(m => m[1].trim());
    const linkMatch = e.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/);
    const url = linkMatch ? linkMatch[1] : id;
    return { id, title, summary, authors, published, url };
  });
}

