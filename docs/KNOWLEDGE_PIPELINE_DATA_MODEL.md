# Knowledge Pipeline Data Model

Date: 2026-02-07

## Resource

```ts
{
  id: string,
  title: string,
  creators: string[],
  institution: string,
  url: string,
  type: 'textbook' | 'lecture-notes' | 'syllabus' | 'problem-set' | 'courseware' | 'article' | 'preprint' | 'reference' | 'government-publication',
  license: 'CC-BY' | 'CC-BY-SA' | 'CC-BY-NC' | 'CC0' | 'Public Domain' | 'Open - Terms Required' | 'Unknown' | 'Proprietary',
  access: 'open' | 'registration' | 'paywall' | 'forbidden',
  topic_tags: string[],
  level: 'middle-school' | 'high-school' | 'undergrad' | 'grad',
  extracted_text_path: string,
  pdf_path?: string,
  references: string[],
  retrieved_at: string,
  checksum: string,
  provenance: {
    sourceUrl: string,
    retrievalDate: string,
    licenseNotes: string,
    citationSnippet: string,
    complianceFlags: string[]
  }
}
```

## CourseBlueprint

```ts
{
  id: string,
  subject: string,
  level: 'middle-school' | 'high-school' | 'undergrad' | 'grad',
  outcomes: string[],
  prerequisites: string[],
  modules: ModuleSpec[],
  resourceIds: string[],
  generatedAt: string,
  mode: 'manual'
}
```

## ModuleSpec

```ts
{
  moduleId: string,
  title: string,
  prerequisites: string[],
  objectives: string[],
  lessons: LessonSpec[],
  projectSpecs: string[],
  citationResourceIds: string[]
}
```

## LessonSpec

```ts
{
  lessonId: string,
  title: string,
  objectives: string[],
  recommendedResourceIds: string[],
  practiceSpecs: string[],
  masteryCheckSpecs: string[],
  sourceMap: Array<{ section: string, resourceIds: string[] }>
}
```
