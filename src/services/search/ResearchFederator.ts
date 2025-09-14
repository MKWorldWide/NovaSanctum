import { internationalResearchDatabase } from '@/services/InternationalResearchDatabase';
import { topScienceInstitutes } from '@/services/TopScienceInstitutes';
import { googleCseSearch, WebResult } from './providers/GoogleCseProvider';
import { crossrefSearch } from './providers/CrossrefProvider';
import { arxivSearch } from './providers/ArxivProvider';
import { pubmedSearch } from './providers/PubMedProvider';
import { semanticScholarSearch } from './providers/SemanticScholarProvider';

export type FederatedOptions = {
  includeWeb?: boolean;
  trustedOnly?: boolean;
  limitWeb?: number;
};

export async function federatedSearch(query: string, options: FederatedOptions = {}) {
  const { includeWeb = true, trustedOnly = true, limitWeb = 10 } = options;

  // Internal providers
  const facilitiesByName = internationalResearchDatabase
    .getFacilities()
    .filter(f => f.name?.toLowerCase().includes(query.toLowerCase()));
  const facilitiesBySpecialty = internationalResearchDatabase.searchFacilitiesBySpecialty(query);
  const publications = internationalResearchDatabase.searchPublicationsByKeyword(query);
  const patents = internationalResearchDatabase
    .getPatents()
    .filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.abstract.toLowerCase().includes(query.toLowerCase()));

  const institutesByName = topScienceInstitutes
    .getTopInstitutes(200)
    .filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
  const institutesBySpecialty = topScienceInstitutes.searchInstitutesBySpecialty(query);
  const labsBySpecialty = topScienceInstitutes.searchLaboratoriesBySpecialty(query);

  const dedupe = <T, K>(items: T[], key: (x: T) => K) => {
    const seen = new Set<K>();
    const out: T[] = [];
    for (const it of items) {
      const k = key(it);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(it);
      }
    }
    return out;
  };

  // Optional web results
  let web: WebResult[] = [];
  if (includeWeb) {
    try {
      web = await googleCseSearch(query, trustedOnly, limitWeb);
    } catch {
      web = [];
    }
  }

  // Scholarly providers
  const [crossref, arxiv, pubmed, s2] = await Promise.all([
    crossrefSearch(query, 10).catch(() => []),
    arxivSearch(query, 10).catch(() => []),
    pubmedSearch(query, 10).catch(() => []),
    semanticScholarSearch(query, 10).catch(() => []),
  ]);

  return {
    facilities: dedupe([...facilitiesByName, ...facilitiesBySpecialty], (f: any) => f.id),
    publications,
    patents,
    institutes: dedupe([...institutesByName, ...institutesBySpecialty], (i: any) => i.id),
    laboratories: labsBySpecialty,
    web,
    scholarly: { crossref, arxiv, pubmed, semanticScholar: s2 },
  };
}
