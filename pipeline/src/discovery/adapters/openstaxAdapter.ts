import { DiscoveryRequest } from '../../shared/types';
import { AdapterCandidate, DiscoveryAdapter } from './types';

const OPENSTAX_CATALOG: AdapterCandidate[] = [
  {
    url: 'https://openstax.org/details/books/calculus-volume-1',
    title: 'Calculus Volume 1',
    author: 'OpenStax',
    institution: 'OpenStax',
    year: 2016,
    resourceType: 'textbook',
    license: 'CC-BY',
    access: 'open',
  },
  {
    url: 'https://openstax.org/details/books/calculus-volume-2',
    title: 'Calculus Volume 2',
    author: 'OpenStax',
    institution: 'OpenStax',
    year: 2016,
    resourceType: 'textbook',
    license: 'CC-BY',
    access: 'open',
  },
  {
    url: 'https://openstax.org/details/books/precalculus-2e',
    title: 'Precalculus 2e',
    author: 'OpenStax',
    institution: 'OpenStax',
    year: 2021,
    resourceType: 'textbook',
    license: 'CC-BY',
    access: 'open',
  },
  {
    url: 'https://openstax.org/details/books/introductory-statistics',
    title: 'Introductory Statistics',
    author: 'OpenStax',
    institution: 'OpenStax',
    year: 2019,
    resourceType: 'textbook',
    license: 'CC-BY',
    access: 'open',
  },
  {
    url: 'https://openstax.org/details/books/principles-economics-3e',
    title: 'Principles of Economics 3e',
    author: 'OpenStax',
    institution: 'OpenStax',
    year: 2023,
    resourceType: 'textbook',
    license: 'CC-BY',
    access: 'open',
  },
];

export const openStaxAdapter: DiscoveryAdapter = {
  name: 'openstax',
  async discover(request: DiscoveryRequest): Promise<AdapterCandidate[]> {
    const terms = request.subject
      .toLowerCase()
      .split(/\s+/)
      .map(term => term.trim())
      .filter(term => term.length > 2);
    return OPENSTAX_CATALOG.filter(item => {
      const haystack = `${item.title} ${item.url}`.toLowerCase();
      return terms.some(term => haystack.includes(term));
    });
  },
};
