import Database from 'better-sqlite3';
import { searchResources } from '../db/sqlite';
import { Resource } from '../shared/types';

export function queryIndex(db: Database.Database, query: string, limit = 10): Resource[] {
  const sanitizedQuery = query
    .trim()
    .split(/\s+/)
    .map(token => `${token}*`)
    .join(' ');

  if (!sanitizedQuery) {
    return [];
  }

  try {
    return searchResources(db, sanitizedQuery, limit);
  } catch {
    return [];
  }
}

export function inferPrerequisitesFromIndex(db: Database.Database, subject: string): string[] {
  const results = queryIndex(db, subject, 15);
  const tagFrequency = new Map<string, number>();

  for (const resource of results) {
    for (const tag of resource.topic_tags) {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    }
  }

  return [...tagFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
}
