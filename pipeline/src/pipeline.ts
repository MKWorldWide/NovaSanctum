import Database from 'better-sqlite3';
import { discoverResources } from './discovery/discover';
import { ingestUrl } from './ingest/pipeline';
import { DiscoveryRequest, DiscoveredResource, PipelineConfig } from './shared/types';

export async function discoverAndOptionallyIngest(
  db: Database.Database,
  config: PipelineConfig,
  request: DiscoveryRequest,
  ingestTop = 0
): Promise<{ discovered: DiscoveredResource[]; ingestedCount: number; skippedCount: number }> {
  const discovered = await discoverResources(request, config);
  const minScore = config.discovery?.minScore ?? 6;
  const ingestable = discovered.filter(resource => resource.score >= minScore);

  let ingestedCount = 0;
  let skippedCount = 0;

  for (const resource of ingestable.slice(0, Math.max(ingestTop, 0))) {
    const result = await ingestUrl(db, config, resource.url, {
      subject: request.subject,
      level: request.level,
    });

    if (result.skipped) {
      skippedCount += 1;
    } else {
      ingestedCount += 1;
    }
  }

  return { discovered, ingestedCount, skippedCount };
}
