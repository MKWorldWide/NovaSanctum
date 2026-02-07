import { DiscoveryRequest } from '../../shared/types';
import { fetchWithPolicy } from '../../shared/http';
import { loadConfig } from '../../shared/config';
import { AdapterCandidate, DiscoveryAdapter } from './types';

const FALLBACK_MIT: AdapterCandidate[] = [
  {
    url: 'https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/',
    title: 'Single Variable Calculus',
    author: 'MIT Faculty',
    institution: 'MIT OpenCourseWare',
    year: 2006,
    resourceType: 'courseware',
    license: 'CC-BY-NC',
    access: 'open',
  },
  {
    url: 'https://ocw.mit.edu/courses/18-02-multivariable-calculus-fall-2007/',
    title: 'Multivariable Calculus',
    author: 'MIT Faculty',
    institution: 'MIT OpenCourseWare',
    year: 2007,
    resourceType: 'courseware',
    license: 'CC-BY-NC',
    access: 'open',
  },
  {
    url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/',
    title: 'Introduction to Computer Science and Programming in Python',
    author: 'MIT Faculty',
    institution: 'MIT OpenCourseWare',
    year: 2016,
    resourceType: 'courseware',
    license: 'CC-BY-NC',
    access: 'open',
  },
];

export const mitOcwAdapter: DiscoveryAdapter = {
  name: 'mit-ocw',
  async discover(request: DiscoveryRequest): Promise<AdapterCandidate[]> {
    const config = loadConfig();
    const query = encodeURIComponent(request.subject);
    const terms = request.subject
      .toLowerCase()
      .split(/\s+/)
      .map(term => term.trim())
      .filter(term => term.length > 2);
    const searchUrl = `https://ocw.mit.edu/search/?q=${query}`;

    try {
      const response = await fetchWithPolicy(searchUrl, config);
      if (!response.ok) {
        return fallback(request.subject);
      }

      const html = await response.text();
      const matches = Array.from(html.matchAll(/href="(\/courses\/[^"]+)"/g)).slice(0, 8);

      if (matches.length === 0) {
        return fallback(request.subject);
      }

      return matches
        .map(match => {
          const relative = match[1];
          const normalizedUrl = `https://ocw.mit.edu${relative}`;
          const title = relative
            .split('/')
            .filter(Boolean)
            .slice(-1)[0]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

          return {
            url: normalizedUrl,
            title,
            author: 'MIT Faculty',
            institution: 'MIT OpenCourseWare',
            resourceType: 'courseware' as const,
            license: 'CC-BY-NC' as const,
            access: 'open' as const,
          };
        })
        .filter(item =>
          terms.some(term => `${item.title} ${item.url}`.toLowerCase().includes(term))
        );
    } catch {
      return fallback(request.subject);
    }
  },
};

function fallback(subject: string): AdapterCandidate[] {
  const terms = subject
    .toLowerCase()
    .split(/\s+/)
    .map(term => term.trim())
    .filter(term => term.length > 2);
  return FALLBACK_MIT.filter(item =>
    terms.some(term => `${item.title} ${item.url}`.toLowerCase().includes(term))
  );
}
