import { DiscoveryRequest } from '../../shared/types';
import { fetchWithPolicy } from '../../shared/http';
import { loadConfig } from '../../shared/config';
import { normalizeWhitespace } from '../../shared/utils';
import { AdapterCandidate, DiscoveryAdapter } from './types';

export const arxivAdapter: DiscoveryAdapter = {
  name: 'arxiv',
  async discover(request: DiscoveryRequest): Promise<AdapterCandidate[]> {
    const config = loadConfig();
    const terms = request.subject
      .toLowerCase()
      .split(/\s+/)
      .map(term => term.trim())
      .filter(term => term.length > 2);
    const logicalQuery = terms.length > 0 ? terms.join('+AND+') : request.subject;
    const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(logicalQuery)}&start=0&max_results=12`;

    try {
      const response = await fetchWithPolicy(url, config);
      if (!response.ok) {
        return [];
      }

      const xml = await response.text();
      const entries = xml.split('<entry>').slice(1);

      return entries
        .map(entry => {
          const title = normalizeWhitespace(extractTag(entry, 'title') || 'arXiv resource');
          const link = extractLink(entry) || extractTag(entry, 'id') || 'https://arxiv.org/';
          const year = Number((extractTag(entry, 'published') || '').slice(0, 4)) || undefined;

          return {
            url: link,
            title,
            author: 'arXiv contributors',
            institution: 'arXiv',
            year,
            resourceType: 'preprint' as const,
            license: 'Open - Terms Required' as const,
            access: 'open' as const,
          };
        })
        .filter(candidate =>
          terms.some(term => `${candidate.title} ${candidate.url}`.toLowerCase().includes(term))
        );
    } catch {
      return [];
    }
  },
};

function extractTag(block: string, tag: string): string | null {
  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = block.match(pattern);
  return match ? match[1].trim() : null;
}

function extractLink(block: string): string | null {
  const match = block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i);
  return match ? match[1] : null;
}
