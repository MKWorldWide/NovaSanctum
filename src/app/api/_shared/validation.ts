export function assertString(
  value: unknown,
  field: string,
  opts: { min?: number; max?: number } = {}
): string {
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string.`);
  }
  const trimmed = value.trim();
  if (opts.min !== undefined && trimmed.length < opts.min) {
    throw new Error(`${field} must be at least ${opts.min} characters.`);
  }
  if (opts.max !== undefined && trimmed.length > opts.max) {
    throw new Error(`${field} must be at most ${opts.max} characters.`);
  }
  return trimmed;
}

export function assertNumber(
  value: unknown,
  field: string,
  opts: { min?: number; max?: number; integer?: boolean } = {}
): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${field} must be a number.`);
  }
  if (opts.integer && !Number.isInteger(value)) {
    throw new Error(`${field} must be an integer.`);
  }
  if (opts.min !== undefined && value < opts.min) {
    throw new Error(`${field} must be >= ${opts.min}.`);
  }
  if (opts.max !== undefined && value > opts.max) {
    throw new Error(`${field} must be <= ${opts.max}.`);
  }
  return value;
}

export function assertBoolean(value: unknown, field: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${field} must be a boolean.`);
  }
  return value;
}

export function assertStringArray(
  value: unknown,
  field: string,
  opts: { minItems?: number; maxItems?: number; itemMin?: number; itemMax?: number } = {}
): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array.`);
  }
  if (opts.minItems !== undefined && value.length < opts.minItems) {
    throw new Error(`${field} must include at least ${opts.minItems} items.`);
  }
  if (opts.maxItems !== undefined && value.length > opts.maxItems) {
    throw new Error(`${field} must include at most ${opts.maxItems} items.`);
  }
  return value.map((item, index) =>
    assertString(item, `${field}[${index}]`, { min: opts.itemMin, max: opts.itemMax })
  );
}

export function assertEnum<T extends readonly string[]>(
  value: unknown,
  field: string,
  choices: T
): T[number] {
  const validated = assertString(value, field);
  if (!choices.includes(validated)) {
    throw new Error(`${field} must be one of: ${choices.join(', ')}`);
  }
  return validated as T[number];
}
