import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { CourseBlueprint, Level, ModuleSpec, Resource } from '../shared/types';
import { inferPrerequisiteHints } from '../ingest/classify';
import { listResourcesBySubject } from '../db/sqlite';
import { slugify, unique } from '../shared/utils';

export interface BuildBlueprintInput {
  subject: string;
  level: Level;
  outcomes: string[];
  outputDir: string;
}

export interface BuildBlueprintResult {
  blueprint: CourseBlueprint;
  markdownPath: string;
  jsonPath: string;
}

export function buildCourseBlueprint(
  db: Database.Database,
  input: BuildBlueprintInput
): BuildBlueprintResult {
  const resources = listResourcesBySubject(db, input.subject, input.level);
  if (resources.length === 0) {
    throw new Error(
      `No indexed resources found for subject "${input.subject}" at level "${input.level}".`
    );
  }

  const modules = createModules(input.subject, input.outcomes, resources);
  const blueprint: CourseBlueprint = {
    id: `${slugify(input.subject)}-${input.level}`,
    subject: input.subject,
    level: input.level,
    outcomes: input.outcomes,
    prerequisites: inferPrerequisiteHints(input.subject, input.level),
    modules,
    resourceIds: unique(modules.flatMap(module => module.citationResourceIds)),
    generatedAt: new Date().toISOString(),
    mode: 'manual',
  };

  const targetDir = path.resolve(input.outputDir, slugify(input.subject));
  fs.mkdirSync(targetDir, { recursive: true });

  const jsonPath = path.resolve(targetDir, 'course_blueprint.json');
  fs.writeFileSync(jsonPath, JSON.stringify(blueprint, null, 2), 'utf8');

  const markdownPath = path.resolve(targetDir, 'COURSE_BLUEPRINT.md');
  fs.writeFileSync(markdownPath, renderBlueprintMarkdown(blueprint, resources), 'utf8');

  return { blueprint, markdownPath, jsonPath };
}

function createModules(subject: string, outcomes: string[], resources: Resource[]): ModuleSpec[] {
  const subjectLower = subject.toLowerCase();

  if (subjectLower.includes('calculus')) {
    return calculusModules(resources, outcomes);
  }

  return genericModules(subject, resources, outcomes);
}

function calculusModules(resources: Resource[], outcomes: string[]): ModuleSpec[] {
  const moduleDefs = [
    {
      key: 'limits-continuity',
      title: 'Module 1: Limits and Continuity',
      matchTerms: ['limit', 'continuity', 'precalculus'],
      objectives: [
        'Explain intuitive and formal notions of limits.',
        'Evaluate one-sided and two-sided limits.',
        'Determine continuity and classify discontinuities.',
      ],
      projectSpecs: [
        'Create a concept map comparing algebraic and graphical limit evaluation techniques.',
      ],
    },
    {
      key: 'derivatives',
      title: 'Module 2: Derivatives and Differentiation Rules',
      matchTerms: ['derivative', 'differentiation', 'tangent', 'rate of change'],
      objectives: [
        'Compute derivatives using limit definitions.',
        'Apply product, quotient, and chain rules correctly.',
        'Interpret derivatives as rates of change in applied contexts.',
      ],
      projectSpecs: [
        'Analyze a real-world changing quantity and justify a derivative-based model.',
      ],
    },
    {
      key: 'applications',
      title: 'Module 3: Applications of Derivatives',
      matchTerms: ['optimization', 'related rates', 'maxima', 'minima'],
      objectives: [
        'Solve optimization problems with clear assumptions.',
        'Use derivatives to analyze monotonicity and concavity.',
        'Apply related rates in geometric and physical settings.',
      ],
      projectSpecs: [
        'Design and solve an optimization scenario with constraints and interpretation.',
      ],
    },
    {
      key: 'integrals',
      title: 'Module 4: Integrals and Fundamental Theorem of Calculus',
      matchTerms: ['integral', 'antiderivative', 'riemann', 'fundamental theorem'],
      objectives: [
        'Interpret definite integrals as accumulation.',
        'Compute antiderivatives and definite integrals.',
        'Use the Fundamental Theorem of Calculus to connect derivatives and integrals.',
      ],
      projectSpecs: [
        'Model accumulation in a practical scenario and validate with a numerical check.',
      ],
    },
  ];

  return moduleDefs.map((def, index) => {
    const matched = matchResources(resources, def.matchTerms);
    const citations = chooseCitations(matched, resources, 3);

    return {
      moduleId: def.key,
      title: def.title,
      prerequisites:
        index === 0
          ? ['Algebra fluency', 'Function notation', 'Graph interpretation']
          : ['Completion of prior module milestones'],
      objectives: [...def.objectives, ...outcomes.slice(0, 1)],
      lessons: buildLessons(def.title, def.objectives, citations),
      projectSpecs: def.projectSpecs,
      citationResourceIds: citations.map(r => r.id),
    };
  });
}

function genericModules(subject: string, resources: Resource[], outcomes: string[]): ModuleSpec[] {
  const defs = [
    {
      key: 'foundations',
      title: `Module 1: ${subject} Foundations`,
      terms: ['intro', 'foundation', 'basics'],
    },
    {
      key: 'core-concepts',
      title: `Module 2: ${subject} Core Concepts`,
      terms: ['core', 'theory', 'concepts'],
    },
    {
      key: 'practice',
      title: `Module 3: ${subject} Guided Practice`,
      terms: ['exercise', 'problem', 'practice'],
    },
    {
      key: 'applications',
      title: `Module 4: ${subject} Applied Work`,
      terms: ['application', 'project', 'case'],
    },
  ];

  return defs.map((def, idx) => {
    const matched = matchResources(resources, def.terms);
    const citations = chooseCitations(matched, resources, 3);

    return {
      moduleId: def.key,
      title: def.title,
      prerequisites:
        idx === 0 ? ['Baseline familiarity with the subject'] : ['Prior module completion'],
      objectives: [
        `Build competency in ${subject} for module stage ${idx + 1}.`,
        ...outcomes.slice(0, 2),
      ],
      lessons: buildLessons(def.title, outcomes, citations),
      projectSpecs: [`Complete a standards-aligned mini project for ${def.title}.`],
      citationResourceIds: citations.map(r => r.id),
    };
  });
}

function buildLessons(moduleTitle: string, objectives: string[], citations: Resource[]) {
  return [
    {
      lessonId: `${slugify(moduleTitle)}-lesson-1`,
      title: `${moduleTitle} - Conceptual Grounding`,
      objectives: objectives.slice(0, 2),
      recommendedResourceIds: citations.map(c => c.id),
      practiceSpecs: [
        'Short-form concept checks mapped to learning objectives.',
        'Worked example deconstruction exercise.',
      ],
      masteryCheckSpecs: [
        '2 conceptual prompts requiring explanation of reasoning.',
        '1 procedural prompt requiring step-by-step method.',
      ],
      sourceMap: [
        {
          section: 'Concept explanation',
          resourceIds: citations.map(c => c.id),
        },
      ],
    },
    {
      lessonId: `${slugify(moduleTitle)}-lesson-2`,
      title: `${moduleTitle} - Problem Solving and Application`,
      objectives: objectives.slice(1, 3),
      recommendedResourceIds: citations.map(c => c.id),
      practiceSpecs: [
        'Guided problem set with increasing difficulty.',
        'Reflection checkpoint connecting methods to outcomes.',
      ],
      masteryCheckSpecs: [
        '1 applied scenario requiring method selection and justification.',
        'Rubric-based self-assessment against module objectives.',
      ],
      sourceMap: [
        {
          section: 'Applied walkthrough',
          resourceIds: citations.map(c => c.id),
        },
      ],
    },
  ];
}

function matchResources(resources: Resource[], terms: string[]): Resource[] {
  const normalizedTerms = terms.map(term => term.toLowerCase());
  return resources.filter(resource => {
    const haystack = `${resource.title} ${resource.topic_tags.join(' ')}`.toLowerCase();
    return normalizedTerms.some(term => haystack.includes(term));
  });
}

function chooseCitations(primary: Resource[], fallback: Resource[], count: number): Resource[] {
  const pool = uniqueById([...primary, ...fallback]);
  return pool.slice(0, count);
}

function uniqueById(resources: Resource[]): Resource[] {
  const seen = new Set<string>();
  const out: Resource[] = [];
  for (const resource of resources) {
    if (seen.has(resource.id)) {
      continue;
    }
    seen.add(resource.id);
    out.push(resource);
  }
  return out;
}

function renderBlueprintMarkdown(blueprint: CourseBlueprint, resources: Resource[]): string {
  const resourceMap = new Map(resources.map(resource => [resource.id, resource]));

  const lines: string[] = [];
  lines.push(`# ${blueprint.subject} Course Blueprint`);
  lines.push('');
  lines.push(`- Level: ${blueprint.level}`);
  lines.push(`- Generated: ${blueprint.generatedAt}`);
  lines.push(`- Mode: ${blueprint.mode}`);
  lines.push('');
  lines.push('## Prerequisites');
  for (const prerequisite of blueprint.prerequisites) {
    lines.push(`- ${prerequisite}`);
  }
  lines.push('');

  for (const moduleSpec of blueprint.modules) {
    lines.push(`## ${moduleSpec.title}`);
    lines.push('');
    lines.push('### Learning Objectives');
    for (const objective of moduleSpec.objectives) {
      lines.push(`- ${objective}`);
    }
    lines.push('');

    lines.push('### Lessons');
    for (const lesson of moduleSpec.lessons) {
      lines.push(`#### ${lesson.title}`);
      lines.push('- Objectives:');
      for (const objective of lesson.objectives) {
        lines.push(`  - ${objective}`);
      }
      lines.push('- Practice specs:');
      for (const spec of lesson.practiceSpecs) {
        lines.push(`  - ${spec}`);
      }
      lines.push('- Mastery check specs:');
      for (const spec of lesson.masteryCheckSpecs) {
        lines.push(`  - ${spec}`);
      }
      lines.push('');
    }

    lines.push('### Recommended Resources');
    for (const resourceId of moduleSpec.citationResourceIds) {
      const resource = resourceMap.get(resourceId);
      if (!resource) {
        continue;
      }
      lines.push(
        `- [${resource.title}](${resource.url}) - ${resource.institution}; license: ${resource.license}; access: ${resource.access}`
      );
    }
    lines.push('');

    lines.push('### Project Specs');
    for (const projectSpec of moduleSpec.projectSpecs) {
      lines.push(`- ${projectSpec}`);
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}
