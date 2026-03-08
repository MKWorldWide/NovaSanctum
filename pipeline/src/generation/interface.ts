import { CourseBlueprint, GenerationMode } from '../shared/types';

export interface LessonGenerationRequest {
  blueprint: CourseBlueprint;
  moduleId: string;
  mode: GenerationMode;
  apiKey?: string;
}

export interface LessonDraft {
  moduleId: string;
  lessonId: string;
  title: string;
  bodyMarkdown: string;
  quizDraft: Array<{ prompt: string; answerType: 'short' | 'mcq' | 'numeric' }>;
  sourceMap: Array<{ section: string; resourceIds: string[] }>;
  citations: string[];
}

export interface LessonGenerationProvider {
  generateLesson(request: LessonGenerationRequest): Promise<LessonDraft[]>;
}

export class ManualModeGenerator implements LessonGenerationProvider {
  async generateLesson(request: LessonGenerationRequest): Promise<LessonDraft[]> {
    const moduleSpec = request.blueprint.modules.find(item => item.moduleId === request.moduleId);
    if (!moduleSpec) {
      throw new Error(`Module not found: ${request.moduleId}`);
    }

    return moduleSpec.lessons.map(lesson => ({
      moduleId: moduleSpec.moduleId,
      lessonId: lesson.lessonId,
      title: lesson.title,
      bodyMarkdown:
        'Manual Mode: author lesson narrative directly using the recommended resources and source map.',
      quizDraft: lesson.masteryCheckSpecs.map(spec => ({
        prompt: spec,
        answerType: 'short' as const,
      })),
      sourceMap: lesson.sourceMap,
      citations: moduleSpec.citationResourceIds,
    }));
  }
}

export class ByoKeyGenerator implements LessonGenerationProvider {
  async generateLesson(request: LessonGenerationRequest): Promise<LessonDraft[]> {
    if (!request.apiKey) {
      throw new Error('BYO key mode requires an apiKey.');
    }

    const moduleSpec = request.blueprint.modules.find(item => item.moduleId === request.moduleId);
    if (!moduleSpec) {
      throw new Error(`Module not found: ${request.moduleId}`);
    }

    const drafts: LessonDraft[] = [];
    for (const lesson of moduleSpec.lessons) {
      const generated = await generateByoLessonMarkdown({
        apiKey: request.apiKey,
        moduleTitle: moduleSpec.title,
        lessonTitle: lesson.title,
        objectives: lesson.objectives,
        practiceSpecs: lesson.practiceSpecs,
        masteryCheckSpecs: lesson.masteryCheckSpecs,
        sourceMap: lesson.sourceMap,
        allowedCitationIds: moduleSpec.citationResourceIds,
      });

      drafts.push({
        moduleId: moduleSpec.moduleId,
        lessonId: lesson.lessonId,
        title: lesson.title,
        bodyMarkdown: generated.bodyMarkdown,
        quizDraft: lesson.masteryCheckSpecs.map(spec => ({
          prompt: spec,
          answerType: 'short' as const,
        })),
        sourceMap: generated.sourceMap,
        citations: moduleSpec.citationResourceIds,
      });
    }

    return drafts;
  }
}

export class PaidModeGenerator implements LessonGenerationProvider {
  async generateLesson(_request: LessonGenerationRequest): Promise<LessonDraft[]> {
    throw new Error('Paid mode is designed but not implemented in v0.');
  }
}

export function getGenerationProvider(mode: GenerationMode): LessonGenerationProvider {
  if (mode === 'manual') {
    return new ManualModeGenerator();
  }
  if (mode === 'byo-key') {
    return new ByoKeyGenerator();
  }
  return new PaidModeGenerator();
}

type GeneratedSection = {
  section: string;
  content: string;
  citationResourceIds: string[];
};

async function generateByoLessonMarkdown(params: {
  apiKey: string;
  moduleTitle: string;
  lessonTitle: string;
  objectives: string[];
  practiceSpecs: string[];
  masteryCheckSpecs: string[];
  sourceMap: Array<{ section: string; resourceIds: string[] }>;
  allowedCitationIds: string[];
}): Promise<{
  bodyMarkdown: string;
  sourceMap: Array<{ section: string; resourceIds: string[] }>;
}> {
  const model = process.env.NS_BYO_MODEL || 'gpt-4o-mini';
  const baseUrl = process.env.NS_BYO_BASE_URL || 'https://api.openai.com/v1';
  const systemPrompt =
    'You are an instructional writer. Return strict JSON only. Include citations for every section.';
  const userPrompt = [
    `Module: ${params.moduleTitle}`,
    `Lesson: ${params.lessonTitle}`,
    `Objectives: ${params.objectives.join(' | ')}`,
    `Practice specs: ${params.practiceSpecs.join(' | ')}`,
    `Mastery checks: ${params.masteryCheckSpecs.join(' | ')}`,
    `Allowed citation IDs: ${params.allowedCitationIds.join(', ')}`,
    'Return JSON with key "sections": Array<{section:string, content:string, citationResourceIds:string[]}>.',
    'Every section must include at least one citationResourceId and all IDs must come from allowed IDs.',
  ].join('\n');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`BYO model request failed (${response.status}): ${errorBody.slice(0, 200)}`);
  }

  const raw = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = raw.choices?.[0]?.message?.content || '';
  if (!content) {
    throw new Error('BYO model response was empty.');
  }

  let parsed: { sections?: GeneratedSection[] };
  try {
    parsed = JSON.parse(content) as { sections?: GeneratedSection[] };
  } catch {
    throw new Error('BYO model returned invalid JSON content.');
  }

  const sections = parsed.sections || [];
  if (sections.length === 0) {
    throw new Error('BYO model returned no sections.');
  }

  for (const section of sections) {
    if (!section.section || !section.content) {
      throw new Error('Each generated section must include section and content.');
    }
    if (!Array.isArray(section.citationResourceIds) || section.citationResourceIds.length === 0) {
      throw new Error(`Section "${section.section}" is missing citations.`);
    }
    const invalid = section.citationResourceIds.filter(
      id => !params.allowedCitationIds.includes(id)
    );
    if (invalid.length > 0) {
      throw new Error(
        `Section "${section.section}" contains invalid citation IDs: ${invalid.join(', ')}`
      );
    }
  }

  const bodyMarkdown = sections
    .map(
      section =>
        `## ${section.section}\n\n${section.content}\n\nCitations: ${section.citationResourceIds
          .map(id => `\`${id}\``)
          .join(', ')}`
    )
    .join('\n\n');

  return {
    bodyMarkdown,
    sourceMap: sections.map(section => ({
      section: section.section,
      resourceIds: section.citationResourceIds,
    })),
  };
}
