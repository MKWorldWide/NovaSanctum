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
  async generateLesson(_request: LessonGenerationRequest): Promise<LessonDraft[]> {
    throw new Error('BYO Key mode is designed but not implemented in v0.');
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
