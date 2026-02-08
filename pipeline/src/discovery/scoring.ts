import { DiscoveredResource, DiscoveryRequest, QualitySignal } from '../shared/types';

const INSTITUTION_SCORES: Record<string, number> = {
  'MIT OpenCourseWare': 10,
  MIT: 10,
  Stanford: 9,
  Harvard: 9,
  Yale: 9,
  Princeton: 9,
  Berkeley: 9,
  Oxford: 9,
  Cambridge: 9,
  OpenStax: 9,
  NCBI: 9,
  PubMed: 9,
  arXiv: 8,
  NIST: 8,
  NASA: 8,
  NIH: 8,
  CDC: 8,
  NOAA: 8,
  CFPB: 9,
  FDIC: 9,
  'MyMoney.gov': 8,
  'Federal Reserve': 8,
  'Khan Academy': 7,
  'Investor.gov': 8,
};

const TYPE_SCORES: Record<DiscoveredResource['resourceType'], number> = {
  textbook: 9,
  'lecture-notes': 8,
  syllabus: 7,
  'problem-set': 9,
  courseware: 8,
  article: 7,
  preprint: 6,
  reference: 6,
  'government-publication': 7,
};

const LICENSE_SCORES: Record<DiscoveredResource['license'], number> = {
  'CC-BY': 10,
  'CC-BY-SA': 10,
  'CC-BY-NC': 8,
  CC0: 10,
  'Public Domain': 10,
  'Open - Terms Required': 6,
  Unknown: 3,
  Proprietary: 1,
};

export function scoreDiscoveryResult(
  resource: Omit<DiscoveredResource, 'score' | 'qualitySignals' | 'relevanceRationale'>,
  request: DiscoveryRequest
): Pick<DiscoveredResource, 'score' | 'qualitySignals' | 'relevanceRationale'> {
  const institutionScore = INSTITUTION_SCORES[resource.institution] || 5;
  const typeScore = TYPE_SCORES[resource.resourceType] || 5;
  const licenseScore = LICENSE_SCORES[resource.license] || 3;

  const titleText = `${resource.title} ${resource.author} ${resource.institution}`.toLowerCase();
  const subjectTerms = request.subject
    .toLowerCase()
    .split(/\s+/)
    .map(term => term.trim())
    .filter(term => term.length > 2);
  const matches = subjectTerms.filter(term => titleText.includes(term)).length;
  const subjectMatchScore = Math.min(matches * 2, 10);
  const domainBoost = computeDomainPriorityBoost(resource.url);

  const levelHintScore = estimateLevelMatchScore(resource.title, request.level);
  const qualitySignals: QualitySignal[] = [
    { label: 'institution_reputation', value: institutionScore },
    { label: 'resource_type_fit', value: typeScore },
    { label: 'license_openness', value: licenseScore },
    { label: 'subject_keyword_overlap', value: subjectMatchScore },
    { label: 'level_fit', value: levelHintScore },
    { label: 'domain_priority_boost', value: domainBoost },
  ];

  const score =
    institutionScore * 0.3 +
    typeScore * 0.25 +
    licenseScore * 0.2 +
    subjectMatchScore * 0.15 +
    levelHintScore * 0.1 +
    domainBoost;

  const rationale =
    `Matched ${matches} subject terms; scored strongly for ${resource.institution} ` +
    `with ${resource.resourceType} format and ${resource.license} licensing.`;

  return {
    score: Number(score.toFixed(2)),
    qualitySignals,
    relevanceRationale: rationale,
  };
}

function computeDomainPriorityBoost(url: string): number {
  const host = new URL(url).hostname.toLowerCase();
  if (
    host.includes('ocw.mit.edu') ||
    host.includes('openstax.org') ||
    host.includes('consumerfinance.gov') ||
    host.includes('fdic.gov') ||
    host.includes('federalreserve') ||
    host.includes('mymoney.gov')
  ) {
    return 0.6;
  }
  if (host.includes('arxiv.org') || host.includes('ncbi.nlm.nih.gov') || host.includes('pubmed')) {
    return 0.35;
  }
  return 0;
}

function estimateLevelMatchScore(title: string, level: DiscoveryRequest['level']): number {
  const lower = title.toLowerCase();

  if (level === 'undergrad' && /intro|fundamentals|i\b|101/.test(lower)) {
    return 9;
  }
  if (level === 'grad' && /advanced|graduate|ii\b|theory/.test(lower)) {
    return 9;
  }
  if (level === 'high-school' && /basic|foundations|pre/.test(lower)) {
    return 8;
  }
  if (level === 'middle-school' && /beginner|introduction/.test(lower)) {
    return 8;
  }

  return 6;
}
