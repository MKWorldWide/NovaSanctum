import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { fetchWithPolicy } from '../shared/http';
import { sha256, sanitizeFilename, normalizeWhitespace } from '../shared/utils';
import { PipelineConfig, Resource, Level } from '../shared/types';
import {
  checkUrlEligibility,
  evaluateContentCompliance,
  loadDoNotIngestPatterns,
} from '../compliance/policy';
import { extractFromHtml } from './extractHtml';
import { extractFromPdfBuffer } from './extractPdf';
import { inferInstitution, inferResourceType, inferTopicTags } from './classify';
import { findByChecksum, upsertResource } from '../db/sqlite';

export interface IngestOptions {
  subject?: string;
  level?: Level;
}

export interface IngestResult {
  resource?: Resource;
  skipped: boolean;
  reason?: string;
}

export async function ingestUrl(
  db: Database.Database,
  config: PipelineConfig,
  url: string,
  options: IngestOptions = {}
): Promise<IngestResult> {
  const doNotIngest = loadDoNotIngestPatterns(config);
  const eligibility = checkUrlEligibility(url, config, doNotIngest);

  if (!eligibility.allowed) {
    logDoNotIngest(url, eligibility.flags.join(','), config);
    return { skipped: true, reason: `URL blocked by compliance: ${eligibility.flags.join(', ')}` };
  }

  const response = await fetchWithPolicy(url, config);
  if (!response.ok) {
    return { skipped: true, reason: `HTTP ${response.status} for ${url}` };
  }

  const contentType = response.headers.get('content-type') || '';
  const isPdf = /application\/pdf/i.test(contentType) || url.toLowerCase().endsWith('.pdf');

  const retrievedAt = new Date().toISOString();
  const rawBuffer = Buffer.from(await response.arrayBuffer());
  let title = 'Untitled Resource';
  let institution = inferInstitution(url);
  let extractedText = '';
  let citationSnippet = '';
  let pdfPath: string | undefined;
  let extractedTextPath = '';
  let creator = 'Unknown author';
  let licenseContentSample = '';

  if (isPdf) {
    const baseName = sanitizeFilename(sha256(rawBuffer).slice(0, 20));
    pdfPath = path.resolve(config.storage.rawPdfDir, `${baseName}.pdf`);
    fs.writeFileSync(pdfPath, rawBuffer);

    const parsed = await extractFromPdfBuffer(rawBuffer);
    extractedText = normalizeWhitespace(parsed.text);
    title = inferTitleFromPdfText(extractedText, url);
    citationSnippet = extractedText.slice(0, 280);
    licenseContentSample = extractedText.slice(0, 2000);
  } else {
    const html = rawBuffer.toString('utf8');
    const htmlName = sanitizeFilename(sha256(html).slice(0, 20));
    const htmlPath = path.resolve(config.storage.rawHtmlDir, `${htmlName}.html`);
    fs.writeFileSync(htmlPath, html);

    const parsed = extractFromHtml(html, url);
    title = parsed.title;
    creator = parsed.byline;
    institution = inferInstitution(url, parsed.institution);
    extractedText = parsed.textContent;
    citationSnippet = parsed.excerpt.slice(0, 280);
    licenseContentSample = `${parsed.licenseText} ${parsed.textContent.slice(0, 2000)}`;
  }

  if (!extractedText || extractedText.length < 120) {
    return { skipped: true, reason: `Insufficient extractable text for ${url}` };
  }

  const contentCompliance = evaluateContentCompliance(licenseContentSample);
  if (!contentCompliance.allowed) {
    logDoNotIngest(url, contentCompliance.flags.join(','), config);
    return {
      skipped: true,
      reason: `Blocked by content compliance: ${contentCompliance.flags.join(', ')}`,
    };
  }

  const checksum = sha256(`${url}\n${title}\n${extractedText.slice(0, 20000)}`);
  const existing = findByChecksum(db, checksum);
  if (existing) {
    return { resource: existing, skipped: true, reason: 'Duplicate by checksum' };
  }

  const textFileName = sanitizeFilename(`${checksum.slice(0, 24)}.txt`);
  extractedTextPath = path.resolve(config.storage.extractedTextDir, textFileName);
  fs.writeFileSync(extractedTextPath, extractedText, 'utf8');

  const subject = options.subject || title;
  const resource: Resource = {
    id: makeResourceId(url, checksum),
    title,
    creators: [creator],
    institution,
    url,
    type: inferResourceType(title, url, contentType),
    license: contentCompliance.licenseGuess,
    access: contentCompliance.access,
    topic_tags: inferTopicTags(subject, title, extractedText),
    level: options.level || 'undergrad',
    extracted_text_path: extractedTextPath,
    pdf_path: pdfPath,
    references: [citationSnippet],
    retrieved_at: retrievedAt,
    checksum,
    provenance: {
      sourceUrl: url,
      retrievalDate: retrievedAt,
      licenseNotes: contentCompliance.licenseGuess,
      citationSnippet,
      complianceFlags: [...eligibility.flags, ...contentCompliance.flags],
    },
  };

  upsertResource(db, resource, extractedText);
  return { resource, skipped: false };
}

function inferTitleFromPdfText(text: string, url: string): string {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const firstLine = lines[0];
  if (firstLine && firstLine.length >= 4 && firstLine.length < 160) {
    return firstLine;
  }

  const urlBits = url.split('/').filter(Boolean);
  return urlBits[urlBits.length - 1] || 'PDF Resource';
}

function makeResourceId(url: string, checksum: string): string {
  const host = new URL(url).hostname.replace(/[^a-z0-9]+/gi, '-');
  return `${host}-${checksum.slice(0, 16)}`;
}

function logDoNotIngest(url: string, reason: string, config: PipelineConfig): void {
  const logPath = path.resolve(path.dirname(config.doNotIngestPatternsPath), 'do-not-ingest.log');
  const line = `${new Date().toISOString()}\t${url}\t${reason}\n`;
  fs.appendFileSync(logPath, line, 'utf8');
}
