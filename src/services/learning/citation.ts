import { CitationValidationResult } from './types';

export function validateCitationMap(
  sourceMap: Array<{ section: string; resourceIds: string[] }>,
  allowedCitationIds: string[]
): CitationValidationResult {
  const missingSections: string[] = [];
  const invalidResourceIds: string[] = [];

  for (const section of sourceMap) {
    if (!section.resourceIds || section.resourceIds.length === 0) {
      missingSections.push(section.section);
      continue;
    }

    for (const resourceId of section.resourceIds) {
      if (!allowedCitationIds.includes(resourceId)) {
        invalidResourceIds.push(resourceId);
      }
    }
  }

  return {
    valid: missingSections.length === 0 && invalidResourceIds.length === 0,
    missingSections,
    invalidResourceIds,
  };
}
