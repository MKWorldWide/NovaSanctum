export type ResourceType =
  | 'textbook'
  | 'lecture-notes'
  | 'syllabus'
  | 'problem-set'
  | 'courseware'
  | 'article'
  | 'preprint'
  | 'reference'
  | 'government-publication';

export type AccessStatus = 'open' | 'registration' | 'paywall' | 'forbidden';

export type LicenseType =
  | 'CC-BY'
  | 'CC-BY-SA'
  | 'CC-BY-NC'
  | 'CC0'
  | 'Public Domain'
  | 'Open - Terms Required'
  | 'Unknown'
  | 'Proprietary';

export type Level = 'middle-school' | 'high-school' | 'undergrad' | 'grad';
export type CurationStatus = 'automated-discovery' | 'reviewed' | 'rejected';

export interface DiscoveryRequest {
  subject: string;
  level: Level;
  targetOutcomes: string[];
  maxResults?: number;
}

export interface QualitySignal {
  label: string;
  value: string | number;
}

export interface DiscoveredResource {
  url: string;
  title: string;
  author: string;
  institution: string;
  year?: number;
  resourceType: ResourceType;
  license: LicenseType;
  access: AccessStatus;
  relevanceRationale: string;
  qualitySignals: QualitySignal[];
  score: number;
}

export interface ProvenanceRecord {
  sourceUrl: string;
  retrievalDate: string;
  licenseNotes: string;
  citationSnippet: string;
  complianceFlags: string[];
}

export interface Resource {
  id: string;
  title: string;
  creators: string[];
  institution: string;
  url: string;
  type: ResourceType;
  license: LicenseType;
  access: AccessStatus;
  topic_tags: string[];
  level: Level;
  extracted_text_path: string;
  pdf_path?: string;
  references: string[];
  retrieved_at: string;
  checksum: string;
  curation_status: CurationStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  provenance: ProvenanceRecord;
}

export interface LessonSpec {
  lessonId: string;
  title: string;
  objectives: string[];
  recommendedResourceIds: string[];
  practiceSpecs: string[];
  masteryCheckSpecs: string[];
  sourceMap: Array<{ section: string; resourceIds: string[] }>;
}

export interface ModuleSpec {
  moduleId: string;
  title: string;
  prerequisites: string[];
  objectives: string[];
  lessons: LessonSpec[];
  projectSpecs: string[];
  citationResourceIds: string[];
}

export interface CourseBlueprint {
  id: string;
  subject: string;
  level: Level;
  outcomes: string[];
  prerequisites: string[];
  modules: ModuleSpec[];
  resourceIds: string[];
  generatedAt: string;
  mode: 'manual';
}

export type GenerationMode = 'manual' | 'byo-key' | 'paid';

export interface PipelineConfig {
  allowedDomains: string[];
  blockedDomains: string[];
  doNotIngestPatternsPath: string;
  maxDownloadSizeMb: number;
  userAgent: string;
  rateLimit: {
    requestsPerDomainPerMinute: number;
  };
  discovery: {
    minScore: number;
  };
  storage: {
    databasePath: string;
    rawHtmlDir: string;
    rawPdfDir: string;
    extractedTextDir: string;
    discoveryDir: string;
    blueprintDir: string;
  };
}
