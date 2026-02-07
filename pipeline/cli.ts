#!/usr/bin/env node
import { Command } from 'commander';
import { loadConfig } from './src/shared/config';
import { openDatabase } from './src/db/sqlite';
import { discoverResources } from './src/discovery/discover';
import { ingestUrl } from './src/ingest/pipeline';
import { buildCourseBlueprint } from './src/blueprint/generator';
import { queryIndex } from './src/indexing/search';
import { discoverAndOptionallyIngest } from './src/pipeline';
import { Level } from './src/shared/types';

const program = new Command();

program
  .name('nova-pipeline')
  .description('NovaSanctum Knowledge Aggregation + Curriculum Synthesis CLI')
  .version('0.1.0');

program
  .command('discover')
  .requiredOption('--subject <subject>', 'Subject to discover resources for')
  .requiredOption('--level <level>', 'Target level: middle-school|high-school|undergrad|grad')
  .option('--outcomes <outcomes>', 'Comma-separated outcomes', '')
  .option('--max-results <maxResults>', 'Max number of results to return', '20')
  .action(async options => {
    const config = loadConfig();
    const db = openDatabase(config.storage.databasePath);

    try {
      const outcomes = parseOutcomes(options.outcomes);
      const results = await discoverResources(
        {
          subject: options.subject,
          level: options.level as Level,
          targetOutcomes: outcomes,
          maxResults: Number(options.maxResults),
        },
        config
      );

      console.log(JSON.stringify(results, null, 2));
      console.log(`\nDiscovered ${results.length} resources.`);
      db.close();
    } catch (error) {
      db.close();
      throw error;
    }
  });

program
  .command('ingest')
  .requiredOption('--url <url>', 'Resource URL to ingest')
  .option('--subject <subject>', 'Subject label used for topic tagging')
  .option('--level <level>', 'Target level')
  .action(async options => {
    const config = loadConfig();
    const db = openDatabase(config.storage.databasePath);

    try {
      const result = await ingestUrl(db, config, options.url, {
        subject: options.subject,
        level: options.level as Level | undefined,
      });

      if (result.skipped) {
        console.log(`Skipped: ${result.reason}`);
      } else {
        console.log('Ingested resource:');
        console.log(JSON.stringify(result.resource, null, 2));
      }

      db.close();
    } catch (error) {
      db.close();
      throw error;
    }
  });

program
  .command('build-blueprint')
  .requiredOption('--subject <subject>', 'Subject to build blueprint for')
  .requiredOption('--level <level>', 'Target level')
  .option('--outcomes <outcomes>', 'Comma-separated outcomes', '')
  .option('--seed-ingest <count>', 'Discover + ingest top N resources before build', '8')
  .action(async options => {
    const config = loadConfig();
    const db = openDatabase(config.storage.databasePath);

    try {
      const outcomes = parseOutcomes(options.outcomes);
      const seedIngest = Number(options.seedIngest);

      await discoverAndOptionallyIngest(
        db,
        config,
        {
          subject: options.subject,
          level: options.level as Level,
          targetOutcomes: outcomes,
          maxResults: Math.max(seedIngest, 20),
        },
        seedIngest
      );

      const result = buildCourseBlueprint(db, {
        subject: options.subject,
        level: options.level as Level,
        outcomes,
        outputDir: config.storage.blueprintDir,
      });

      console.log(`Blueprint JSON: ${result.jsonPath}`);
      console.log(`Blueprint Markdown: ${result.markdownPath}`);
      db.close();
    } catch (error) {
      db.close();
      throw error;
    }
  });

program
  .command('search-index')
  .requiredOption('--query <query>', 'Search query')
  .option('--limit <limit>', 'Result limit', '10')
  .action(options => {
    const config = loadConfig();
    const db = openDatabase(config.storage.databasePath);

    try {
      const results = queryIndex(db, options.query, Number(options.limit));
      console.log(JSON.stringify(results, null, 2));
      db.close();
    } catch (error) {
      db.close();
      throw error;
    }
  });

program.parseAsync(process.argv).catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

function parseOutcomes(input: string): string[] {
  return input
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}
