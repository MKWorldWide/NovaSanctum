import fs from 'node:fs';
import path from 'node:path';
import { PipelineConfig } from './types';

export function loadConfig(configPath?: string): PipelineConfig {
  const resolvedPath = configPath
    ? path.resolve(configPath)
    : path.resolve(process.cwd(), 'pipeline/config/default.config.json');

  const raw = fs.readFileSync(resolvedPath, 'utf8');
  const parsed = JSON.parse(raw) as PipelineConfig;

  const withResolvedPaths: PipelineConfig = {
    ...parsed,
    doNotIngestPatternsPath: resolveAgainstRepo(parsed.doNotIngestPatternsPath),
    storage: {
      ...parsed.storage,
      databasePath: resolveAgainstRepo(parsed.storage.databasePath),
      rawHtmlDir: resolveAgainstRepo(parsed.storage.rawHtmlDir),
      rawPdfDir: resolveAgainstRepo(parsed.storage.rawPdfDir),
      extractedTextDir: resolveAgainstRepo(parsed.storage.extractedTextDir),
      discoveryDir: resolveAgainstRepo(parsed.storage.discoveryDir),
      blueprintDir: resolveAgainstRepo(parsed.storage.blueprintDir),
    },
  };

  ensureDirectories(withResolvedPaths);
  return withResolvedPaths;
}

function resolveAgainstRepo(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.resolve(process.cwd(), filePath);
}

function ensureDirectories(config: PipelineConfig): void {
  const dirs = [
    path.dirname(config.storage.databasePath),
    config.storage.rawHtmlDir,
    config.storage.rawPdfDir,
    config.storage.extractedTextDir,
    config.storage.discoveryDir,
    config.storage.blueprintDir,
  ];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
