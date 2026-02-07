import Database from 'better-sqlite3';
import { Resource } from '../shared/types';

export function openDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  initializeSchema(db);
  return db;
}

function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      creators_json TEXT NOT NULL,
      institution TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      license TEXT NOT NULL,
      access TEXT NOT NULL,
      topic_tags_json TEXT NOT NULL,
      level TEXT NOT NULL,
      extracted_text_path TEXT NOT NULL,
      pdf_path TEXT,
      references_json TEXT NOT NULL,
      retrieved_at TEXT NOT NULL,
      checksum TEXT NOT NULL UNIQUE,
      provenance_json TEXT NOT NULL,
      extracted_text TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS resource_fts USING fts5(
      resource_id,
      title,
      institution,
      topic_tags,
      content
    );

    CREATE INDEX IF NOT EXISTS idx_resources_title ON resources(title);
    CREATE INDEX IF NOT EXISTS idx_resources_url ON resources(url);
    CREATE INDEX IF NOT EXISTS idx_resources_level ON resources(level);
    CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
    CREATE INDEX IF NOT EXISTS idx_resources_checksum ON resources(checksum);
  `);
}

export function upsertResource(
  db: Database.Database,
  resource: Resource,
  extractedText: string
): void {
  const insertResource = db.prepare(`
    INSERT INTO resources (
      id, title, creators_json, institution, url, type, license, access,
      topic_tags_json, level, extracted_text_path, pdf_path, references_json,
      retrieved_at, checksum, provenance_json, extracted_text, created_at
    ) VALUES (
      @id, @title, @creators_json, @institution, @url, @type, @license, @access,
      @topic_tags_json, @level, @extracted_text_path, @pdf_path, @references_json,
      @retrieved_at, @checksum, @provenance_json, @extracted_text, @created_at
    )
    ON CONFLICT(checksum) DO UPDATE SET
      title=excluded.title,
      creators_json=excluded.creators_json,
      institution=excluded.institution,
      url=excluded.url,
      type=excluded.type,
      license=excluded.license,
      access=excluded.access,
      topic_tags_json=excluded.topic_tags_json,
      level=excluded.level,
      extracted_text_path=excluded.extracted_text_path,
      pdf_path=excluded.pdf_path,
      references_json=excluded.references_json,
      retrieved_at=excluded.retrieved_at,
      provenance_json=excluded.provenance_json,
      extracted_text=excluded.extracted_text
  `);

  insertResource.run({
    id: resource.id,
    title: resource.title,
    creators_json: JSON.stringify(resource.creators),
    institution: resource.institution,
    url: resource.url,
    type: resource.type,
    license: resource.license,
    access: resource.access,
    topic_tags_json: JSON.stringify(resource.topic_tags),
    level: resource.level,
    extracted_text_path: resource.extracted_text_path,
    pdf_path: resource.pdf_path || null,
    references_json: JSON.stringify(resource.references),
    retrieved_at: resource.retrieved_at,
    checksum: resource.checksum,
    provenance_json: JSON.stringify(resource.provenance),
    extracted_text: extractedText,
    created_at: new Date().toISOString(),
  });

  const deleteFts = db.prepare('DELETE FROM resource_fts WHERE resource_id = ?');
  deleteFts.run(resource.id);

  const insertFts = db.prepare(`
    INSERT INTO resource_fts (resource_id, title, institution, topic_tags, content)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertFts.run(
    resource.id,
    resource.title,
    resource.institution,
    resource.topic_tags.join(', '),
    extractedText
  );
}

export function findByChecksum(db: Database.Database, checksum: string): Resource | null {
  const row = db.prepare('SELECT * FROM resources WHERE checksum = ? LIMIT 1').get(checksum) as
    | Record<string, unknown>
    | undefined;

  if (!row) {
    return null;
  }

  return rowToResource(row);
}

export function searchResources(db: Database.Database, query: string, limit = 10): Resource[] {
  const rows = db
    .prepare(
      `
      SELECT r.*
      FROM resource_fts f
      JOIN resources r ON r.id = f.resource_id
      WHERE resource_fts MATCH ?
      LIMIT ?
    `
    )
    .all(query, limit) as Record<string, unknown>[];

  return rows.map(rowToResource);
}

export function listResourcesBySubject(
  db: Database.Database,
  subject: string,
  level?: string
): Resource[] {
  const like = `%${subject.toLowerCase()}%`;

  const rows = level
    ? (db
        .prepare(
          `
          SELECT *
          FROM resources
          WHERE (lower(title) LIKE ? OR lower(topic_tags_json) LIKE ?)
            AND level = ?
          ORDER BY retrieved_at DESC
        `
        )
        .all(like, like, level) as Record<string, unknown>[])
    : (db
        .prepare(
          `
          SELECT *
          FROM resources
          WHERE lower(title) LIKE ? OR lower(topic_tags_json) LIKE ?
          ORDER BY retrieved_at DESC
        `
        )
        .all(like, like) as Record<string, unknown>[]);

  return rows.map(rowToResource);
}

function rowToResource(row: Record<string, unknown>): Resource {
  return {
    id: String(row.id),
    title: String(row.title),
    creators: JSON.parse(String(row.creators_json)),
    institution: String(row.institution),
    url: String(row.url),
    type: row.type as Resource['type'],
    license: row.license as Resource['license'],
    access: row.access as Resource['access'],
    topic_tags: JSON.parse(String(row.topic_tags_json)),
    level: row.level as Resource['level'],
    extracted_text_path: String(row.extracted_text_path),
    pdf_path: row.pdf_path ? String(row.pdf_path) : undefined,
    references: JSON.parse(String(row.references_json)),
    retrieved_at: String(row.retrieved_at),
    checksum: String(row.checksum),
    provenance: JSON.parse(String(row.provenance_json)),
  };
}
