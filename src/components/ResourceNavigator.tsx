'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type ResourceKind = 'article' | 'preprint' | 'medical' | 'reference';

type LearningResource = {
  id: string;
  title: string;
  kind: ResourceKind;
  source: string;
  url?: string;
  summary?: string;
  authors?: string[];
  year?: number;
  venue?: string;
  access: 'open';
};

type SearchResponse = {
  query: string;
  timestamp: string;
  total: number;
  resources: LearningResource[];
  sourceBreakdown: Record<string, number>;
  error?: string;
};

const kindLabels: Record<ResourceKind, string> = {
  article: 'Article',
  preprint: 'Preprint',
  medical: 'Medical Literature',
  reference: 'Reference',
};

export default function ResourceNavigator() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [includeWeb, setIncludeWeb] = useState(true);
  const [trustedOnly, setTrustedOnly] = useState(true);
  const [resourceKind, setResourceKind] = useState<'all' | ResourceKind>('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

  const runSearch = useCallback(
    async (q: string) => {
      if (!q) {
        setResult(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, includeWeb, trustedOnly }),
        });

        const payload = (await response.json()) as SearchResponse;
        if (!response.ok) {
          throw new Error(payload.error || 'Search failed');
        }

        setResult(payload);
      } catch (requestError: unknown) {
        const message =
          requestError instanceof Error ? requestError.message : 'Unable to complete search';
        setError(message);
        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [includeWeb, trustedOnly]
  );

  useEffect(() => {
    void runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  const availableSources = useMemo(() => {
    if (!result) return [];
    return Object.keys(result.sourceBreakdown).sort((a, b) => a.localeCompare(b));
  }, [result]);

  const filteredResources = useMemo(() => {
    if (!result) return [];
    return result.resources.filter(resource => {
      const kindMatch = resourceKind === 'all' || resource.kind === resourceKind;
      const sourceMatch = sourceFilter === 'all' || resource.source === sourceFilter;
      return kindMatch && sourceMatch;
    });
  }, [result, resourceKind, sourceFilter]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Learning Resource Navigator
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
          Search open-access literature and references to support NovaSanctum pathways. Results are
          aggregated from public scholarly indexes and optional web sources.
        </p>

        <div className="mt-6 space-y-3">
          <label htmlFor="resource-query" className="block text-sm font-medium text-slate-800">
            Search query
          </label>
          <div className="flex gap-2">
            <input
              id="resource-query"
              type="text"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="e.g., introductory statistics, open pedagogy, Python for data analysis"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={() => void runSearch(query.trim())}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2 lg:grid-cols-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeWeb}
              onChange={event => setIncludeWeb(event.target.checked)}
            />
            Include web references
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={trustedOnly}
              onChange={event => setTrustedOnly(event.target.checked)}
            />
            Trusted-domain filtering
          </label>
          <label className="inline-flex items-center gap-2">
            <span>Resource type</span>
            <select
              value={resourceKind}
              onChange={event => setResourceKind(event.target.value as 'all' | ResourceKind)}
              className="rounded border border-slate-300 bg-white px-2 py-1"
            >
              <option value="all">All</option>
              <option value="article">Articles</option>
              <option value="preprint">Preprints</option>
              <option value="medical">Medical</option>
              <option value="reference">References</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-2">
            <span>Source</span>
            <select
              value={sourceFilter}
              onChange={event => setSourceFilter(event.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-1"
            >
              <option value="all">All</option>
              {availableSources.map(source => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Searching public indexes...
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {result ? (
        <section className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded bg-slate-100 px-2 py-1">Query: {result.query}</span>
            <span className="rounded bg-slate-100 px-2 py-1">Total: {result.total}</span>
            <span className="rounded bg-slate-100 px-2 py-1">
              Generated: {new Date(result.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredResources.map(resource => (
              <article
                key={resource.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {kindLabels[resource.kind]} • {resource.source}
                </p>
                <h2 className="mt-1 text-base font-semibold text-slate-900">{resource.title}</h2>
                {resource.summary ? (
                  <p className="mt-2 text-sm leading-6 text-slate-700">{resource.summary}</p>
                ) : null}
                <div className="mt-3 text-xs text-slate-600">
                  {resource.authors && resource.authors.length ? (
                    <p>Authors: {resource.authors.slice(0, 5).join(', ')}</p>
                  ) : null}
                  {resource.venue ? <p>Venue: {resource.venue}</p> : null}
                  {resource.year ? <p>Year: {resource.year}</p> : null}
                </div>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-900"
                  >
                    Open Source
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          {!filteredResources.length ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              No resources matched the current filters.
            </p>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
