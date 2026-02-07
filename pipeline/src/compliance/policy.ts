import fs from 'node:fs';
import { URL } from 'node:url';
import { AccessStatus, LicenseType, PipelineConfig } from '../shared/types';

const LICENSE_PATTERNS: Array<{ pattern: RegExp; license: LicenseType }> = [
  { pattern: /creative\s+commons\s+attribution\s+sharealike|cc\s*by-sa/i, license: 'CC-BY-SA' },
  { pattern: /creative\s+commons\s+attribution\s+noncommercial|cc\s*by-nc/i, license: 'CC-BY-NC' },
  { pattern: /creative\s+commons\s+attribution|cc\s*by\b/i, license: 'CC-BY' },
  { pattern: /cc0|creative\s+commons\s+zero/i, license: 'CC0' },
  { pattern: /public\s+domain/i, license: 'Public Domain' },
  { pattern: /terms\s+of\s+use|all\s+rights\s+reserved/i, license: 'Open - Terms Required' },
];

const PAYWALL_PATTERNS = [
  /subscribe\s+to\s+continue/i,
  /purchase\s+required/i,
  /sign\s+in\s+to\s+continue/i,
  /paywall/i,
  /members\s+only/i,
  /institutional\s+access\s+required/i,
];

const FORBIDDEN_PATTERNS = [/forbidden/i, /access denied/i, /not authorized/i];

export interface ComplianceDecision {
  allowed: boolean;
  access: AccessStatus;
  flags: string[];
  licenseGuess: LicenseType;
}

export function loadDoNotIngestPatterns(config: PipelineConfig): string[] {
  if (!fs.existsSync(config.doNotIngestPatternsPath)) {
    return [];
  }

  return fs
    .readFileSync(config.doNotIngestPatternsPath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));
}

export function checkUrlEligibility(
  url: string,
  config: PipelineConfig,
  doNotIngestPatterns: string[]
): ComplianceDecision {
  const parsed = new URL(url);
  const domain = parsed.hostname.toLowerCase();
  const flags: string[] = [];

  if (config.blockedDomains.some(blocked => domain === blocked || domain.endsWith(`.${blocked}`))) {
    flags.push('blocked-domain');
    return { allowed: false, access: 'forbidden', flags, licenseGuess: 'Unknown' };
  }

  if (config.allowedDomains.length > 0) {
    const allowed = config.allowedDomains.some(
      allowedDomain => domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
    );
    if (!allowed) {
      flags.push('domain-not-allowlisted');
      return { allowed: false, access: 'forbidden', flags, licenseGuess: 'Unknown' };
    }
  }

  if (doNotIngestPatterns.some(pattern => url.includes(pattern))) {
    flags.push('do-not-ingest-pattern');
    return { allowed: false, access: 'forbidden', flags, licenseGuess: 'Unknown' };
  }

  return { allowed: true, access: 'open', flags, licenseGuess: 'Unknown' };
}

export function evaluateContentCompliance(content: string): ComplianceDecision {
  const flags: string[] = [];
  let access: AccessStatus = 'open';

  if (PAYWALL_PATTERNS.some(pattern => pattern.test(content))) {
    flags.push('paywall-signal');
    access = 'paywall';
  }

  if (FORBIDDEN_PATTERNS.some(pattern => pattern.test(content))) {
    flags.push('forbidden-signal');
    access = 'forbidden';
  }

  const licenseGuess = detectLicense(content);
  if (licenseGuess === 'Unknown') {
    flags.push('unknown-license-manual-review');
  }

  const allowed = access === 'open';
  return { allowed, access, flags, licenseGuess };
}

export function detectLicense(content: string): LicenseType {
  for (const entry of LICENSE_PATTERNS) {
    if (entry.pattern.test(content)) {
      return entry.license;
    }
  }

  if (/all\s+rights\s+reserved/i.test(content)) {
    return 'Proprietary';
  }

  return 'Unknown';
}
