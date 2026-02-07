import { DiscoveryRequest } from '../../shared/types';
import { fetchWithPolicy } from '../../shared/http';
import { loadConfig } from '../../shared/config';
import { AdapterCandidate, DiscoveryAdapter } from './types';

type SearchResponse = {
  esearchresult?: {
    idlist?: string[];
  };
};

type SummaryResponse = {
  result?: Record<
    string,
    {
      title?: string;
      pubdate?: string;
      source?: string;
    }
  >;
};

export const ncbiBookshelfAdapter: DiscoveryAdapter = {
  name: 'ncbi-bookshelf',
  async discover(request: DiscoveryRequest): Promise<AdapterCandidate[]> {
    const config = loadConfig();
    try {
      const searchUrl =
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?' +
        `db=books&retmode=json&retmax=6&term=${encodeURIComponent(request.subject)}`;
      const searchResp = await fetchWithPolicy(searchUrl, config);
      if (!searchResp.ok) {
        return [];
      }

      const search = (await searchResp.json()) as SearchResponse;
      const ids = search.esearchresult?.idlist || [];
      if (ids.length === 0) {
        return [];
      }

      const summaryUrl =
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?' +
        `db=books&retmode=json&id=${ids.join(',')}`;
      const summaryResp = await fetchWithPolicy(summaryUrl, config);
      if (!summaryResp.ok) {
        return [];
      }

      const summary = (await summaryResp.json()) as SummaryResponse;
      const results: AdapterCandidate[] = [];
      for (const id of ids) {
        const item = summary.result?.[id];
        if (!item?.title) {
          continue;
        }

        const year = item.pubdate ? Number(item.pubdate.slice(0, 4)) : undefined;
        results.push({
          url: `https://www.ncbi.nlm.nih.gov/books/${id}/`,
          title: item.title,
          author: item.source || 'NCBI Bookshelf contributors',
          institution: 'NCBI',
          year,
          resourceType: 'reference',
          license: 'Open - Terms Required',
          access: 'open',
        });
      }

      return results;
    } catch {
      return [];
    }
  },
};
