export type PubMedItem = {
  id: string;
  title: string;
  authors?: string[];
  year?: number;
  journal?: string;
  url?: string;
};

export async function pubmedSearch(query: string, limit = 10): Promise<PubMedItem[]> {
  try {
    const retmax = Math.min(Math.max(limit, 1), 20);
    const esearch = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${retmax}&term=${encodeURIComponent(query)}`,
      { cache: 'no-store' }
    );
    if (!esearch.ok) return [];
    const es = await esearch.json();
    const ids: string[] = es?.esearchresult?.idlist || [];
    if (ids.length === 0) return [];
    const esum = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`,
      { cache: 'no-store' }
    );
    if (!esum.ok) return [];
    const summary = await esum.json();
    const result: PubMedItem[] = ids.map(id => {
      const it = summary?.result?.[id];
      const title = it?.title || 'Untitled';
      const authors = (it?.authors || []).map((a: any) => a?.name).filter(Boolean);
      const pubdate = it?.pubdate || '';
      const year = parseInt((pubdate.match(/\d{4}/) || [])[0], 10);
      const journal = it?.fulljournalname || it?.source || undefined;
      const url = `https://pubmed.ncbi.nlm.nih.gov/${id}/`;
      return { id, title, authors, year: isNaN(year) ? undefined : year, journal, url };
    });
    return result;
  } catch {
    return [];
  }
}

