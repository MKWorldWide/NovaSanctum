const REDACTION_PATTERNS = [
  { pattern: /sk-[a-z0-9_-]{10,}/gi, replacement: '[REDACTED_API_KEY]' },
  { pattern: /"byoApiKey"\s*:\s*"[^"]*"/gi, replacement: '"byoApiKey":"[REDACTED]"' },
  { pattern: /"apiKey"\s*:\s*"[^"]*"/gi, replacement: '"apiKey":"[REDACTED]"' },
  { pattern: /"prompt"\s*:\s*"[^"]*"/gi, replacement: '"prompt":"[REDACTED_PROMPT]"' },
  { pattern: /"email"\s*:\s*"[^"]*"/gi, replacement: '"email":"[REDACTED_EMAIL]"' },
];

function redact(value: unknown): string {
  const raw = typeof value === 'string' ? value : JSON.stringify(value);
  if (!raw) return '';
  return REDACTION_PATTERNS.reduce((acc, item) => acc.replace(item.pattern, item.replacement), raw);
}

export const apiLogger = {
  info(message: string, payload?: unknown) {
    if (payload === undefined) {
      console.info(`[NovaSanctum API] ${message}`);
      return;
    }
    console.info(`[NovaSanctum API] ${message}`, redact(payload));
  },

  error(message: string, payload?: unknown) {
    if (payload === undefined) {
      console.error(`[NovaSanctum API] ${message}`);
      return;
    }
    console.error(`[NovaSanctum API] ${message}`, redact(payload));
  },
};
