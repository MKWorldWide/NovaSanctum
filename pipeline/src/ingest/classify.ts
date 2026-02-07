import { Level, ResourceType } from '../shared/types';

export function inferResourceType(title: string, url: string, contentType?: string): ResourceType {
  const text = `${title} ${url} ${contentType || ''}`.toLowerCase();

  if (/syllabus/.test(text)) return 'syllabus';
  if (/problem\s*set|assignments|homework/.test(text)) return 'problem-set';
  if (/lecture\s*notes|notes/.test(text)) return 'lecture-notes';
  if (/textbook|openstax|book/.test(text)) return 'textbook';
  if (/arxiv/.test(text)) return 'preprint';
  if (/pubmed|journal|article/.test(text)) return 'article';
  if (/nist|nasa|nih|cdc|noaa/.test(text)) return 'government-publication';
  if (/course|ocw|openlearn|open\s*course/.test(text)) return 'courseware';
  return 'reference';
}

export function inferInstitution(url: string, fallback = 'Unknown institution'): string {
  const host = new URL(url).hostname.toLowerCase();

  if (host.includes('mit.edu')) return 'MIT';
  if (host.includes('openstax.org')) return 'OpenStax';
  if (host.includes('stanford.edu') || host.includes('stanford')) return 'Stanford';
  if (host.includes('yale.edu') || host.includes('oyc.yale.edu')) return 'Yale';
  if (host.includes('berkeley.edu') || host.includes('open.berkeley.edu')) return 'Berkeley';
  if (host.includes('ox.ac.uk') || host.includes('open.edu')) return 'Oxford';
  if (host.includes('cam.ac.uk')) return 'Cambridge';
  if (host.includes('ncbi.nlm.nih.gov')) return 'NCBI';
  if (host.includes('pubmed.ncbi.nlm.nih.gov')) return 'PubMed';
  if (host.includes('arxiv.org')) return 'arXiv';
  if (host.includes('nist.gov')) return 'NIST';
  if (host.includes('nasa.gov')) return 'NASA';
  if (host.includes('nih.gov')) return 'NIH';
  if (host.includes('cdc.gov')) return 'CDC';
  if (host.includes('noaa.gov')) return 'NOAA';

  return fallback;
}

export function inferTopicTags(subject: string, title: string, text: string): string[] {
  const base = [subject];
  const corpus = `${title} ${text}`.toLowerCase();

  const tags = [
    'limits',
    'derivatives',
    'integrals',
    'series',
    'linear algebra',
    'eigenvalues',
    'python',
    'data structures',
    'algorithms',
    'microeconomics',
    'statistics',
    'probability',
    'biology',
    'chemistry',
    'physics',
  ].filter(tag => corpus.includes(tag));

  return Array.from(new Set([...base, ...tags]));
}

export function inferPrerequisiteHints(subject: string, level: Level): string[] {
  const s = subject.toLowerCase();

  if (s.includes('calculus')) {
    return ['Algebra', 'Functions and graphs', 'Trigonometry'];
  }
  if (s.includes('data structures')) {
    return ['Intro to programming', 'Control flow', 'Basic complexity intuition'];
  }
  if (s.includes('microeconomics')) {
    return ['Basic algebra', 'Reading graphs', 'Percentages'];
  }

  if (level === 'grad') {
    return ['Undergraduate background in the domain'];
  }

  return ['Foundational literacy in the subject area'];
}
