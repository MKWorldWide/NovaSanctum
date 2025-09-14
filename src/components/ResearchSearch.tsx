"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from './Modal';

type Facility = {
  id: string;
  name: string;
  country?: string;
  specialties?: string[];
  website?: string;
  status?: string;
};

type Publication = {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  doi?: string;
  publicationDate?: string | Date;
  category?: string;
};

type Patent = {
  id: string;
  title: string;
  inventors: string[];
  patentNumber: string;
  status?: string;
  category?: string;
};

type Institute = {
  id: string;
  name: string;
  country?: string;
  website?: string;
  specialties?: string[];
};

type Lab = {
  id: string;
  name: string;
  institute?: string;
  type?: string;
  specialties?: string[];
};

type SearchResponse = {
  query: string;
  timestamp: string;
  facilities: Facility[];
  publications: Publication[];
  patents: Patent[];
  institutes: Institute[];
  laboratories: Lab[];
  web?: { title: string; url: string; snippet?: string; source?: string }[];
  error?: string;
};

function Section<T>({ title, items, render }: { title: string; items: T[]; render: (item: T) => React.ReactNode }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title} ({items.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            {render(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResearchSearch() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [includeWeb, setIncludeWeb] = useState(true);
  const [trustedOnly, setTrustedOnly] = useState(true);
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'impact'>('relevance');
  const [details, setDetails] = useState<any | null>(null);

  // Debounce query
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(id);
  }, [query]);

  const search = useCallback(async (q: string) => {
    if (!q) {
      setData(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, includeWeb, trustedOnly }),
      });
      const json = (await res.json()) as SearchResponse;
      if (!res.ok) throw new Error(json?.error || 'Search failed');
      setData(json);
    } catch (e: any) {
      setError(e?.message || 'Search failed');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [includeWeb, trustedOnly]);

  useEffect(() => {
    void search(debounced);
  }, [debounced, search]);

  const hasResults = useMemo(() => {
    return !!(
      data && (
        (data.facilities && data.facilities.length) ||
        (data.publications && data.publications.length) ||
        (data.patents && data.patents.length) ||
        (data.institutes && data.institutes.length) ||
        (data.laboratories && data.laboratories.length)
      )
    );
  }, [data]);

  // Client-side filtering and sorting helpers
  const filtered = useMemo(() => {
    if (!data) return null;
    const yf = parseInt(yearFrom || '0', 10) || undefined;
    const yt = parseInt(yearTo || '0', 10) || undefined;
    const countryLower = country.trim().toLowerCase();
    const categoryLower = category.trim().toLowerCase();
    const domainList = domainFilter
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const inRange = (y?: number) => {
      if (!y) return true;
      if (yf && y < yf) return false;
      if (yt && y > yt) return false;
      return true;
    };

    const pubs = (data.publications || [])
      .filter((p: any) => (categoryLower ? (p.category || '').toLowerCase().includes(categoryLower) : true))
      .filter((p: any) => inRange(p.publicationDate ? new Date(p.publicationDate).getFullYear() : (p.year as number | undefined)));

    const pats = (data.patents || [])
      .filter((p: any) => (categoryLower ? (p.category || '').toLowerCase().includes(categoryLower) : true));

    const facs = (data.facilities || [])
      .filter((f: any) => (countryLower ? (f.country || '').toLowerCase().includes(countryLower) : true));

    const inst = (data.institutes || [])
      .filter((i: any) => (countryLower ? (i.country || '').toLowerCase().includes(countryLower) : true));

    const labs = data.laboratories || [];

    const web = (data.web || []).filter(w => {
      if (domainList.length === 0) return true;
      try {
        const host = new URL(w.url).hostname.toLowerCase();
        return domainList.some(d => host === d || host.endsWith('.' + d));
      } catch {
        return false;
      }
    });

    const byDate = (arr: any[], getDate: (x: any) => Date | undefined) =>
      [...arr].sort((a, b) => {
        const da = getDate(a)?.getTime() || 0;
        const db = getDate(b)?.getTime() || 0;
        return db - da;
      });

    const byImpact = (arr: any[]) =>
      [...arr].sort((a, b) => ((b.impactFactor || b.citations || 0) as number) - ((a.impactFactor || a.citations || 0) as number));

    let pubsSorted = pubs;
    if (sortBy === 'date') pubsSorted = byDate(pubs, (p: any) => (p.publicationDate ? new Date(p.publicationDate) : undefined));
    if (sortBy === 'impact') pubsSorted = byImpact(pubs);

    return { publications: pubsSorted, patents: pats, facilities: facs, institutes: inst, laboratories: labs, web };
  }, [data, yearFrom, yearTo, country, category, domainFilter, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Search Global Research</h1>
        <p className="mt-2 text-gray-600">Query international institutions, publications, patents, and top science institutes.</p>
        <div className="mt-6 relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g., perovskite stability, quantum dots, solid-state battery"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-24 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => search(query.trim())}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" checked={includeWeb} onChange={e => setIncludeWeb(e.target.checked)} />
            Include web results
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" checked={trustedOnly} onChange={e => setTrustedOnly(e.target.checked)} />
            Trusted sources only
          </label>
          <div className="flex items-center gap-2">
            <span>Year</span>
            <input className="w-20 rounded border px-2 py-1" placeholder="From" value={yearFrom} onChange={e => setYearFrom(e.target.value)} />
            <input className="w-20 rounded border px-2 py-1" placeholder="To" value={yearTo} onChange={e => setYearTo(e.target.value)} />
          </div>
          <input className="rounded border px-2 py-1" placeholder="Country filter (e.g., USA, UK)" value={country} onChange={e => setCountry(e.target.value)} />
          <input className="rounded border px-2 py-1" placeholder="Category filter (e.g., solar, battery)" value={category} onChange={e => setCategory(e.target.value)} />
          <input className="rounded border px-2 py-1" placeholder="Domain filter (comma-separated)" value={domainFilter} onChange={e => setDomainFilter(e.target.value)} />
          <div>
            <label className="mr-2">Sort</label>
            <select className="rounded border px-2 py-1" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="impact">Impact</option>
            </select>
          </div>
        </div>
        {loading && (
          <div className="mt-4 text-sm text-gray-500">Searching “{debounced}”...</div>
        )}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}
      </div>

      {!loading && data && (
        <div>
          {(data as any).scholarly && (
            <Section
              title="Scholarly"
              items={(() => {
                const s = (data as any).scholarly || {};
                const x: any[] = [];
                (s.crossref || []).slice(0, 5).forEach((i: any) => x.push({ ...i, provider: 'Crossref' }));
                (s.arxiv || []).slice(0, 5).forEach((i: any) => x.push({ ...i, provider: 'arXiv' }));
                (s.pubmed || []).slice(0, 5).forEach((i: any) => x.push({ ...i, provider: 'PubMed' }));
                (s.semanticScholar || []).slice(0, 5).forEach((i: any) => x.push({ ...i, provider: 'Semantic Scholar' }));
                return x;
              })()}
              render={(it: any) => (
                <div>
                  <div className="font-semibold text-gray-900">{it.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{(it.authors || []).map((a: any) => (typeof a === 'string' ? a : a.name)).filter(Boolean).join(', ')}</div>
                  <div className="mt-1 text-xs text-gray-500">{[it.venue || it.journal, it.year, it.provider].filter(Boolean).join(' • ')}</div>
                  {it.doi && (
                    <a className="mt-2 mr-2 inline-block text-sm text-indigo-600 hover:underline" href={`https://doi.org/${it.doi}`} target="_blank" rel="noreferrer">DOI</a>
                  )}
                  {it.url && (
                    <a className="mt-2 inline-block text-sm text-indigo-600 hover:underline" href={it.url} target="_blank" rel="noreferrer">Open</a>
                  )}
                  <button className="mt-2 ml-2 inline-block text-sm text-gray-700 hover:underline" onClick={() => setDetails({ type: 'scholarly', data: it })}>Details</button>
                </div>
              )}
            />
          )}
          <Section
            title="Publications"
            items={(filtered?.publications as any[]) || []}
            render={(p: any) => (
              <div>
                <div className="font-semibold text-gray-900">{p.title}</div>
                <div className="mt-1 text-sm text-gray-600">{p.authors?.join(', ')}</div>
                <div className="mt-1 text-sm text-gray-500">{p.journal} {p.publicationDate ? `• ${new Date(p.publicationDate).toLocaleDateString()}` : ''}</div>
                {p.doi && (
                  <a
                    className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View DOI
                  </a>
                )}
                <button className="mt-2 inline-block text-sm text-gray-700 hover:underline" onClick={() => setDetails({ type: 'publication', data: p })}>Details</button>
              </div>
            )}
          />

          <Section
            title="Patents"
            items={(filtered?.patents as any[]) || []}
            render={(pt: Patent) => (
              <div>
                <div className="font-semibold text-gray-900">{pt.title}</div>
                <div className="mt-1 text-sm text-gray-600">{pt.inventors?.join(', ')}</div>
                <div className="mt-1 text-sm text-gray-500">Patent No: {pt.patentNumber}</div>
                {pt.category && <div className="mt-1 text-xs text-gray-400">{pt.category}</div>}
                <button className="mt-2 inline-block text-sm text-gray-700 hover:underline" onClick={() => setDetails({ type: 'patent', data: pt })}>Details</button>
              </div>
            )}
          />

          <Section
            title="Facilities"
            items={(filtered?.facilities as any[]) || []}
            render={(f: Facility) => (
              <div>
                <div className="font-semibold text-gray-900">{f.name}</div>
                <div className="mt-1 text-sm text-gray-600">{[f.country, f.status].filter(Boolean).join(' • ')}</div>
                {f.specialties && f.specialties.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {f.specialties.slice(0, 6).map((s, i) => (
                      <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{s}</span>
                    ))}
                  </div>
                )}
                {f.website && (
                  <a className="mt-2 inline-block text-sm text-indigo-600 hover:underline" href={f.website} target="_blank" rel="noreferrer">Website</a>
                )}
                <button className="mt-2 ml-2 inline-block text-sm text-gray-700 hover:underline" onClick={() => setDetails({ type: 'facility', data: f })}>Details</button>
              </div>
            )}
          />

          <Section
            title="Institutes"
            items={(filtered?.institutes as any[]) || []}
            render={(i: Institute) => (
              <div>
                <div className="font-semibold text-gray-900">{i.name}</div>
                <div className="mt-1 text-sm text-gray-600">{i.country}</div>
                {i.specialties && i.specialties.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {i.specialties.slice(0, 6).map((s, idx) => (
                      <span key={idx} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{s}</span>
                    ))}
                  </div>
                )}
                {i.website && (
                  <a className="mt-2 inline-block text-sm text-indigo-600 hover:underline" href={i.website} target="_blank" rel="noreferrer">Website</a>
                )}
                <button className="mt-2 ml-2 inline-block text-sm text-gray-700 hover:underline" onClick={() => setDetails({ type: 'institute', data: i })}>Details</button>
              </div>
            )}
          />

          <Section
            title="Laboratories"
            items={(filtered?.laboratories as any[]) || []}
            render={(l: Lab) => (
              <div>
                <div className="font-semibold text-gray-900">{l.name}</div>
                <div className="mt-1 text-sm text-gray-600">{[l.institute, l.type].filter(Boolean).join(' • ')}</div>
                {l.specialties && l.specialties.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {l.specialties.slice(0, 6).map((s, idx) => (
                      <span key={idx} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{s}</span>
                    ))}
                  </div>
                )}
                <button className="mt-2 inline-block text-sm text-gray-700 hover:underline" onClick={() => setDetails({ type: 'lab', data: l })}>Details</button>
              </div>
            )}
          />

          <Section
            title="Web Results"
            items={((filtered?.web || []) as any[]).slice(0, 12)}
            render={(w: { title: string; url: string; snippet?: string; source?: string }) => (
              <div>
                <a href={w.url} target="_blank" rel="noreferrer" className="font-semibold text-indigo-700 hover:underline">
                  {w.title}
                </a>
                {w.source && <div className="mt-1 text-xs text-gray-500">{w.source}</div>}
                {w.snippet && <div className="mt-2 text-sm text-gray-700">{w.snippet}</div>}
              </div>
            )}
          />

          {!hasResults && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
              No results for “{data?.query}”. Try another term.
            </div>
          )}
        </div>
      )}

      <Modal open={!!details} onClose={() => setDetails(null)} title={details?.type ? String(details.type).toUpperCase() : 'Details'}>
        <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{details ? JSON.stringify(details.data, null, 2) : ''}</pre>
      </Modal>
    </div>
  );
}
