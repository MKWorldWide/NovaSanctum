import { googleCseSearch, WebResult } from './providers/GoogleCseProvider';
import { crossrefSearch } from './providers/CrossrefProvider';
import { arxivSearch } from './providers/ArxivProvider';
import { pubmedSearch } from './providers/PubMedProvider';
import { semanticScholarSearch } from './providers/SemanticScholarProvider';

export type FederatedOptions = {
  includeWeb?: boolean;
  trustedOnly?: boolean;
  limitWeb?: number;
  limitScholarly?: number;
};

export type LearningResourceKind = 'article' | 'preprint' | 'medical' | 'reference';
export type LearningResourceLevel = 'entry' | 'intermediate' | 'advanced';

export type LearningResource = {
  id: string;
  title: string;
  kind: LearningResourceKind;
  source: string;
  url?: string;
  summary?: string;
  authors?: string[];
  year?: number;
  venue?: string;
  access: 'open';
  domain?: string;
  level?: LearningResourceLevel;
  license?: string;
  curationStatus: 'automated-discovery' | 'reviewed';
};

export type FederatedSearchResult = {
  resources: LearningResource[];
  web: WebResult[];
  sourceBreakdown: Record<string, number>;
};

export async function federatedSearch(query: string, options: FederatedOptions = {}) {
  const { includeWeb = true, trustedOnly = true, limitWeb = 10, limitScholarly = 12 } = options;
  const inferDomain = (kind: LearningResourceKind): string => {
    switch (kind) {
      case 'article':
        return 'General Scholarship';
      case 'preprint':
        return 'Science and Technology';
      case 'medical':
        return 'Health and Medical Science';
      case 'reference':
      default:
        return 'General Education';
    }
  };

  const inferLevel = (kind: LearningResourceKind): LearningResourceLevel => {
    switch (kind) {
      case 'reference':
        return 'entry';
      case 'article':
      case 'medical':
        return 'intermediate';
      case 'preprint':
      default:
        return 'advanced';
    }
  };

  const dedupeBy = <T>(items: T[], key: (x: T) => string) => {
    const seen = new Set<string>();
    const out: T[] = [];
    for (const item of items) {
      const k = key(item);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(item);
      }
    }
    return out;
  };

  let web: WebResult[] = [];
  if (includeWeb) {
    try {
      web = await googleCseSearch(query, trustedOnly, limitWeb);
    } catch {
      web = [];
    }
  }

  const [crossref, arxiv, pubmed, s2] = await Promise.all([
    crossrefSearch(query, limitScholarly).catch(() => []),
    arxivSearch(query, limitScholarly).catch(() => []),
    pubmedSearch(query, limitScholarly).catch(() => []),
    semanticScholarSearch(query, limitScholarly).catch(() => []),
  ]);

  const scholarlyResources: LearningResource[] = [
    ...crossref.map(item => ({
      id: `crossref:${item.doi || item.url || item.title}`,
      title: item.title,
      kind: 'article' as const,
      source: 'Crossref',
      url: item.url,
      authors: item.authors,
      year: item.year,
      venue: item.venue,
      access: 'open' as const,
      domain: inferDomain('article'),
      level: inferLevel('article'),
      license: 'See source terms',
      curationStatus: 'automated-discovery' as const,
    })),
    ...arxiv.map(item => ({
      id: `arxiv:${item.id || item.url || item.title}`,
      title: item.title,
      kind: 'preprint' as const,
      source: 'arXiv',
      url: item.url,
      summary: item.summary,
      authors: item.authors,
      year: item.published ? new Date(item.published).getFullYear() : undefined,
      access: 'open' as const,
      domain: inferDomain('preprint'),
      level: inferLevel('preprint'),
      license: 'See source terms',
      curationStatus: 'automated-discovery' as const,
    })),
    ...pubmed.map(item => ({
      id: `pubmed:${item.id || item.url || item.title}`,
      title: item.title,
      kind: 'medical' as const,
      source: 'PubMed',
      url: item.url,
      authors: item.authors,
      year: item.year,
      venue: item.journal,
      access: 'open' as const,
      domain: inferDomain('medical'),
      level: inferLevel('medical'),
      license: 'See source terms',
      curationStatus: 'automated-discovery' as const,
    })),
    ...s2.map(item => ({
      id: `semantic-scholar:${item.url || item.title}`,
      title: item.title,
      kind: 'article' as const,
      source: 'Semantic Scholar',
      url: item.url,
      authors: (item.authors || []).map(a => a.name),
      year: item.year,
      venue: item.venue,
      access: 'open' as const,
      domain: inferDomain('article'),
      level: inferLevel('article'),
      license: 'See source terms',
      curationStatus: 'automated-discovery' as const,
    })),
  ];

  const webResources: LearningResource[] = web.map((result, idx) => ({
    id: `web:${idx}:${result.url}`,
    title: result.title,
    kind: 'reference',
    source: result.source || 'Web',
    url: result.url,
    summary: result.snippet,
    access: 'open',
    domain: inferDomain('reference'),
    level: inferLevel('reference'),
    license: 'See source terms',
    curationStatus: 'automated-discovery',
  }));

  const resources = dedupeBy([...scholarlyResources, ...webResources], resource =>
    (resource.url || resource.title).toLowerCase()
  );

  const sourceBreakdown = resources.reduce<Record<string, number>>((acc, resource) => {
    acc[resource.source] = (acc[resource.source] || 0) + 1;
    return acc;
  }, {});

  return {
    resources,
    web,
    sourceBreakdown,
  } as FederatedSearchResult;
}
