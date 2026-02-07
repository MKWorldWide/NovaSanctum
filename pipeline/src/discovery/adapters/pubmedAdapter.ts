import { DiscoveryRequest } from '../../shared/types';
import { fetchWithPolicy } from '../../shared/http';
import { loadConfig } from '../../shared/config';
import { AdapterCandidate, DiscoveryAdapter } from './types';

type PubMedSearchResponse = {
  esearchresult?: {
    idlist?: string[];
  };
};

type PubMedSummaryResponse = {
  result?: Record<
    string,
    {
      title?: string;
      sortpubdate?: string;
      fulljournalname?: string;
      articleids?: Array<{ idtype?: string; value?: string }>;
    }
  >;
};

export const pubmedAdapter: DiscoveryAdapter = {
  name: 'pubmed',
  async discover(request: DiscoveryRequest): Promise<AdapterCandidate[]> {
    const config = loadConfig();

    try {
      const searchUrl =
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?' +
        `db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent(request.subject)}`;

      const searchResp = await fetchWithPolicy(searchUrl, config);
      if (!searchResp.ok) {
        return [];
      }

      const searchJson = (await searchResp.json()) as PubMedSearchResponse;
      const ids = searchJson.esearchresult?.idlist || [];
      if (ids.length === 0) {
        return [];
      }

      const summaryUrl =
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?' +
        `db=pubmed&retmode=json&id=${ids.join(',')}`;
      const summaryResp = await fetchWithPolicy(summaryUrl, config);
      if (!summaryResp.ok) {
        return [];
      }

      const summaryJson = (await summaryResp.json()) as PubMedSummaryResponse;
      const results: AdapterCandidate[] = [];

      for (const id of ids) {
        const item = summaryJson.result?.[id];
        if (!item?.title) {
          continue;
        }

        const year = item.sortpubdate ? Number(item.sortpubdate.slice(0, 4)) : undefined;
        results.push({
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          title: item.title,
          author: item.fulljournalname || 'PubMed contributors',
          institution: 'PubMed',
          year,
          resourceType: 'article',
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
