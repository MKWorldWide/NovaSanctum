import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { normalizeWhitespace } from '../shared/utils';

export interface HtmlExtractionResult {
  title: string;
  byline: string;
  textContent: string;
  excerpt: string;
  institution: string;
  licenseText: string;
}

export function extractFromHtml(html: string, sourceUrl: string): HtmlExtractionResult {
  const dom = new JSDOM(html, { url: sourceUrl });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const documentTitle = normalizeWhitespace(
    article?.title ||
      dom.window.document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      dom.window.document.title ||
      'Untitled Resource'
  );

  const byline = normalizeWhitespace(
    article?.byline ||
      dom.window.document.querySelector('meta[name="author"]')?.getAttribute('content') ||
      'Unknown author'
  );

  const bodyText = normalizeWhitespace(
    article?.textContent || dom.window.document.body?.textContent || 'No extractable text'
  );

  const siteName =
    dom.window.document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
    dom.window.location.hostname;

  const licenseCandidates = [
    dom.window.document.querySelector('a[rel="license"]')?.textContent || '',
    dom.window.document.querySelector('meta[name="dc.rights"]')?.getAttribute('content') || '',
    bodyText.slice(0, 2000),
  ]
    .join(' ')
    .trim();

  return {
    title: documentTitle,
    byline,
    textContent: bodyText,
    excerpt: bodyText.slice(0, 600),
    institution: normalizeWhitespace(siteName),
    licenseText: licenseCandidates,
  };
}
