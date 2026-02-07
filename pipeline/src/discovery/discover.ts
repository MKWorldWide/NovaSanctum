import fs from 'node:fs';
import path from 'node:path';
import { DiscoveryRequest, DiscoveredResource, PipelineConfig } from '../shared/types';
import { unique } from '../shared/utils';
import { scoreDiscoveryResult } from './scoring';
import { DiscoveryAdapter } from './adapters/types';
import { AdapterCandidate } from './adapters/types';
import { openStaxAdapter } from './adapters/openstaxAdapter';
import { mitOcwAdapter } from './adapters/mitOcwAdapter';
import { arxivAdapter } from './adapters/arxivAdapter';
import { pubmedAdapter } from './adapters/pubmedAdapter';
import { universityCatalogAdapter } from './adapters/universityCatalogAdapter';
import { ncbiBookshelfAdapter } from './adapters/ncbiBookshelfAdapter';

const DEFAULT_ADAPTERS: DiscoveryAdapter[] = [
  openStaxAdapter,
  mitOcwAdapter,
  universityCatalogAdapter,
  arxivAdapter,
  pubmedAdapter,
  ncbiBookshelfAdapter,
];

export async function discoverResources(
  request: DiscoveryRequest,
  config: PipelineConfig,
  adapters: DiscoveryAdapter[] = selectAdapters(request)
): Promise<DiscoveredResource[]> {
  const all = await Promise.all(adapters.map(adapter => adapter.discover(request)));

  const deduped = dedupeByUrl(all.flat());

  const scored = deduped.map(item => {
    const scoring = scoreDiscoveryResult(item, request);
    return {
      ...item,
      ...scoring,
    };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  const limit = request.maxResults || 20;
  const limited = sorted.slice(0, limit);

  const outputPath = path.resolve(
    config.storage.discoveryDir,
    `${sanitizeFilePart(request.subject)}-${request.level}.json`
  );

  fs.writeFileSync(outputPath, JSON.stringify(limited, null, 2), 'utf8');
  return limited;
}

function selectAdapters(request: DiscoveryRequest): DiscoveryAdapter[] {
  const subject = request.subject.toLowerCase();
  const isBiomedical = /(bio|medical|health|medicine|anatomy|physiology|genetics|clinical)/.test(
    subject
  );

  if (isBiomedical) {
    return DEFAULT_ADAPTERS;
  }

  return DEFAULT_ADAPTERS.filter(
    adapter => adapter.name !== 'pubmed' && adapter.name !== 'ncbi-bookshelf'
  );
}

function dedupeByUrl(items: AdapterCandidate[]): AdapterCandidate[] {
  const seen = new Set<string>();
  const out: AdapterCandidate[] = [];

  for (const item of items) {
    const normalized = item.url.replace(/\/$/, '');
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(item);
  }

  return out;
}

function sanitizeFilePart(input: string): string {
  return unique(
    input
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  )
    .join('-')
    .slice(0, 80);
}
