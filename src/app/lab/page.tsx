'use client';

import { useMemo, useState } from 'react';

type Resource = {
  id: string;
  title: string;
  institution: string;
  url: string;
  license: string;
  access: string;
  curation_status: 'automated-discovery' | 'reviewed' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
};

type DiscoverResponse = {
  discovered: Array<{
    url: string;
    title: string;
    institution: string;
    score: number;
    resourceType: string;
    license: string;
    access: string;
    relevanceRationale: string;
  }>;
  ingestedCount: number;
  skippedCount: number;
};

const defaultOutcomes = [
  'Build and sustain a practical monthly budget',
  'Understand credit scores and healthy utilization',
  'Apply debt repayment strategies using APR and term analysis',
  'Use consumer-protection pathways for fraud and reporting issues',
];

export default function PipelineLabPage() {
  const [subject, setSubject] = useState('Money Management & Credit Wisdom');
  const [level, setLevel] = useState<'middle-school' | 'high-school' | 'undergrad' | 'grad'>(
    'high-school'
  );
  const [outcomesText, setOutcomesText] = useState(defaultOutcomes.join('\n'));
  const [reviewer, setReviewer] = useState('Program Lead');
  const [maxResults, setMaxResults] = useState(16);
  const [ingestTop, setIngestTop] = useState(12);
  const [discoverResult, setDiscoverResult] = useState<DiscoverResponse | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const parsedOutcomes = useMemo(
    () =>
      outcomesText
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean),
    [outcomesText]
  );

  const reviewedCount = resources.filter(item => item.curation_status === 'reviewed').length;

  async function runDiscover() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/pipeline/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          level,
          outcomes: parsedOutcomes,
          maxResults,
          ingestTop,
        }),
      });
      const payload = (await response.json()) as DiscoverResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'Discovery failed');
      }
      setDiscoverResult(payload);
      setMessage(
        `Discovery complete. ${payload.discovered.length} ranked, ${payload.ingestedCount} ingested, ${payload.skippedCount} skipped.`
      );
      await loadResources();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Discovery failed');
    } finally {
      setBusy(false);
    }
  }

  async function loadResources() {
    const query = new URLSearchParams({ subject, level, limit: '200' });
    const response = await fetch(`/api/pipeline/resources?${query.toString()}`);
    const payload = (await response.json()) as { resources?: Resource[]; error?: string };
    if (!response.ok) {
      throw new Error(payload.error || 'Failed to load resources');
    }
    setResources(payload.resources || []);
  }

  async function markReviewed(id: string, status: 'reviewed' | 'rejected') {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/pipeline/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          reviewer,
          status,
          notes: `Updated via /lab for ${subject}`,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'Review update failed');
      }

      setMessage(`Resource ${id} marked as ${status}.`);
      await loadResources();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Review update failed');
    } finally {
      setBusy(false);
    }
  }

  async function buildBlueprint() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/pipeline/build-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          level,
          outcomes: parsedOutcomes,
          seedIngest: 0,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        blueprintId?: string;
        jsonPath?: string;
        markdownPath?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || 'Blueprint generation failed');
      }

      setMessage(
        `Blueprint built (${payload.blueprintId}). Markdown: ${payload.markdownPath}. JSON: ${payload.jsonPath}.`
      );
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Blueprint generation failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="panel p-8">
        <h1 className="text-3xl">Pipeline Lab</h1>
        <p className="mt-3 text-sm text-slate-700">
          Local test interface for NovaSanctum discovery, curation review, and blueprint build.
          Default pilot course: <strong>Money Management &amp; Credit Wisdom</strong>.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="text-sm">
            Subject
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={subject}
              onChange={event => setSubject(event.target.value)}
            />
          </label>
          <label className="text-sm">
            Level
            <select
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={level}
              onChange={event =>
                setLevel(
                  event.target.value as 'middle-school' | 'high-school' | 'undergrad' | 'grad'
                )
              }
            >
              <option value="middle-school">middle-school</option>
              <option value="high-school">high-school</option>
              <option value="undergrad">undergrad</option>
              <option value="grad">grad</option>
            </select>
          </label>
          <label className="text-sm">
            Max discovery results
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              type="number"
              min={1}
              max={50}
              value={maxResults}
              onChange={event => setMaxResults(Number(event.target.value || 1))}
            />
          </label>
          <label className="text-sm">
            Seed ingest count
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              type="number"
              min={0}
              max={50}
              value={ingestTop}
              onChange={event => setIngestTop(Number(event.target.value || 0))}
            />
          </label>
        </div>

        <label className="mt-3 block text-sm">
          Outcomes (one per line)
          <textarea
            className="mt-1 min-h-[120px] w-full rounded border border-slate-300 px-3 py-2"
            value={outcomesText}
            onChange={event => setOutcomesText(event.target.value)}
          />
        </label>

        <label className="mt-3 block text-sm">
          Reviewer Name
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={reviewer}
            onChange={event => setReviewer(event.target.value)}
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void runDiscover()}
            disabled={busy}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
          >
            Discover + Seed Ingest
          </button>
          <button
            type="button"
            onClick={() => void loadResources().catch(error => setMessage(String(error)))}
            disabled={busy}
            className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
          >
            Reload Resources
          </button>
          <button
            type="button"
            onClick={() => void buildBlueprint()}
            disabled={busy}
            className="rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 disabled:opacity-60"
          >
            Build Blueprint (Quality Gates On)
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-700">
          Reviewed resources in current subject set: {reviewedCount}
        </p>
        {message ? <p className="mt-2 text-sm text-slate-800">{message}</p> : null}
      </section>

      {discoverResult ? (
        <section className="mt-6 panel p-6">
          <h2 className="text-xl">Discovery Results</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {discoverResult.discovered.map(item => (
              <li key={item.url} className="rounded border border-slate-200 p-3">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p>
                  {item.institution} | score {item.score} | {item.resourceType} | {item.license}
                </p>
                <a href={item.url} target="_blank" rel="noreferrer" className="text-sky-700">
                  {item.url}
                </a>
                <p className="mt-1 text-xs text-slate-600">{item.relevanceRationale}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resources.length ? (
        <section className="mt-6 panel p-6">
          <h2 className="text-xl">Ingested Resources</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {resources.map(resource => (
              <li key={resource.id} className="rounded border border-slate-200 p-3">
                <p className="font-semibold text-slate-900">{resource.title}</p>
                <p className="text-xs text-slate-600">
                  id: {resource.id} | {resource.institution} | status: {resource.curation_status}
                </p>
                {resource.reviewed_by ? (
                  <p className="text-xs text-slate-600">
                    reviewed by {resource.reviewed_by} at {resource.reviewed_at}
                  </p>
                ) : null}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void markReviewed(resource.id, 'reviewed')}
                    disabled={busy}
                    className="rounded border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    type="button"
                    onClick={() => void markReviewed(resource.id, 'rejected')}
                    disabled={busy}
                    className="rounded border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-900"
                  >
                    Mark Rejected
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
