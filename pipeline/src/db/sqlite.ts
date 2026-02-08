import Database from 'better-sqlite3';
import { CurationStatus, Resource } from '../shared/types';

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
      curation_status TEXT NOT NULL DEFAULT 'automated-discovery',
      reviewed_by TEXT,
      reviewed_at TEXT,
      review_notes TEXT,
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

  ensureColumn(db, 'resources', 'curation_status', "TEXT NOT NULL DEFAULT 'automated-discovery'");
  ensureColumn(db, 'resources', 'reviewed_by', 'TEXT');
  ensureColumn(db, 'resources', 'reviewed_at', 'TEXT');
  ensureColumn(db, 'resources', 'review_notes', 'TEXT');

  db.prepare(
    "UPDATE resources SET curation_status = 'automated-discovery' WHERE curation_status IS NULL"
  ).run();
  db.exec(
    'CREATE INDEX IF NOT EXISTS idx_resources_curation_status ON resources(curation_status);'
  );
}

function ensureColumn(
  db: Database.Database,
  tableName: string,
  columnName: string,
  definition: string
): void {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;

  const exists = columns.some(column => column.name === columnName);
  if (!exists) {
    db.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`).run();
  }
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
      retrieved_at, checksum, curation_status, reviewed_by, reviewed_at, review_notes,
      provenance_json, extracted_text, created_at
    ) VALUES (
      @id, @title, @creators_json, @institution, @url, @type, @license, @access,
      @topic_tags_json, @level, @extracted_text_path, @pdf_path, @references_json,
      @retrieved_at, @checksum, @curation_status, @reviewed_by, @reviewed_at, @review_notes,
      @provenance_json, @extracted_text, @created_at
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
      curation_status=excluded.curation_status,
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
    curation_status: resource.curation_status,
    reviewed_by: resource.reviewed_by || null,
    reviewed_at: resource.reviewed_at || null,
    review_notes: resource.review_notes || null,
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

export function updateResourceReview(
  db: Database.Database,
  params: {
    id: string;
    status: CurationStatus;
    reviewer: string;
    notes?: string;
  }
): Resource | null {
  const now = new Date().toISOString();
  db.prepare(
    `
    UPDATE resources
    SET curation_status = ?,
        reviewed_by = ?,
        reviewed_at = ?,
        review_notes = ?
    WHERE id = ?
  `
  ).run(params.status, params.reviewer, now, params.notes || null, params.id);

  return getResourceById(db, params.id);
}

export function getResourceById(db: Database.Database, id: string): Resource | null {
  const row = db.prepare('SELECT * FROM resources WHERE id = ? LIMIT 1').get(id) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToResource(row) : null;
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
  level?: string,
  curationStatus?: CurationStatus
): Resource[] {
  return listResources(db, {
    subject,
    level,
    curationStatus,
  });
}

export function listResources(
  db: Database.Database,
  filters: {
    subject?: string;
    level?: string;
    curationStatus?: CurationStatus;
    limit?: number;
  } = {}
): Resource[] {
  const clauses: string[] = [];
  const values: Array<string | number> = [];

  if (filters.subject) {
    clauses.push('(lower(title) LIKE ? OR lower(topic_tags_json) LIKE ?)');
    const like = `%${filters.subject.toLowerCase()}%`;
    values.push(like, like);
  }

  if (filters.level) {
    clauses.push('level = ?');
    values.push(filters.level);
  }

  if (filters.curationStatus) {
    clauses.push('curation_status = ?');
    values.push(filters.curationStatus);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const limit = filters.limit ?? 100;

  const rows = db
    .prepare(
      `
      SELECT *
      FROM resources
      ${where}
      ORDER BY retrieved_at DESC
      LIMIT ?
    `
    )
    .all(...values, limit) as Record<string, unknown>[];

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
    curation_status: (row.curation_status as CurationStatus) || 'automated-discovery',
    reviewed_by: row.reviewed_by ? String(row.reviewed_by) : undefined,
    reviewed_at: row.reviewed_at ? String(row.reviewed_at) : undefined,
    review_notes: row.review_notes ? String(row.review_notes) : undefined,
    provenance: JSON.parse(String(row.provenance_json)),
  };
}
