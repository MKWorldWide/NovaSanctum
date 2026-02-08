import { loadConfig } from '../../../../pipeline/src/shared/config';
import { openDatabase } from '../../../../pipeline/src/db/sqlite';

export function openPipelineContext() {
  const config = loadConfig();
  const db = openDatabase(config.storage.databasePath);
  return { config, db };
}
