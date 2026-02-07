import { DiscoveryRequest } from '../../shared/types';
import { AdapterCandidate, DiscoveryAdapter } from './types';

const UNIVERSITY_OPEN_CATALOG: AdapterCandidate[] = [
  {
    url: 'https://oyc.yale.edu/math/math-115',
    title: 'Yale Open Courses - Calculus',
    author: 'Yale Faculty',
    institution: 'Yale',
    resourceType: 'courseware',
    license: 'Open - Terms Required',
    access: 'open',
  },
  {
    url: 'https://online.stanford.edu/courses/soe-ycscs101-sp-computer-science-101',
    title: 'Computer Science 101',
    author: 'Stanford Faculty',
    institution: 'Stanford',
    resourceType: 'courseware',
    license: 'Open - Terms Required',
    access: 'registration',
  },
  {
    url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.1x+3T2019/about',
    title: 'Calculus 1A: Differentiation',
    author: 'MIT Faculty',
    institution: 'MIT',
    resourceType: 'courseware',
    license: 'CC-BY-NC',
    access: 'open',
  },
  {
    url: 'https://open.berkeley.edu/courses',
    title: 'Berkeley Open Courses Catalog',
    author: 'UC Berkeley',
    institution: 'Berkeley',
    resourceType: 'courseware',
    license: 'Open - Terms Required',
    access: 'open',
  },
  {
    url: 'https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics',
    title: 'OpenLearn Mathematics and Statistics',
    author: 'Open University',
    institution: 'Oxford',
    resourceType: 'courseware',
    license: 'Open - Terms Required',
    access: 'open',
  },
  {
    url: 'https://nasa.github.io/openmct/',
    title: 'NASA Open MCT Documentation',
    author: 'NASA',
    institution: 'NASA',
    resourceType: 'reference',
    license: 'Open - Terms Required',
    access: 'open',
  },
  {
    url: 'https://www.nist.gov/cyberframework',
    title: 'NIST Cybersecurity Framework',
    author: 'NIST',
    institution: 'NIST',
    resourceType: 'government-publication',
    license: 'Public Domain',
    access: 'open',
  },
];

export const universityCatalogAdapter: DiscoveryAdapter = {
  name: 'university-open-catalog',
  async discover(request: DiscoveryRequest): Promise<AdapterCandidate[]> {
    const terms = request.subject
      .toLowerCase()
      .split(/\s+/)
      .map(term => term.trim())
      .filter(term => term.length > 2);

    return UNIVERSITY_OPEN_CATALOG.filter(item => {
      const haystack = `${item.title} ${item.url} ${item.institution}`.toLowerCase();
      return terms.some(term => haystack.includes(term));
    });
  },
};
