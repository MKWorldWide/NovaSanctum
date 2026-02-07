import Link from 'next/link';

export const metadata = {
  title: 'Program Status | NovaSanctum',
  description: 'Institutional alignment status and phase tracking for NovaSanctum.',
};

const governance = [
  'Mission charter published',
  'AI assistance policy published',
  'Content curation policy published',
  'GameDin boundary policy documented',
];

const engineering = [
  'Off-mission app routes retired',
  'Test and speculative documentation de-bloated',
  'Search API normalized for open resource discovery',
  'Active lint and type-check baseline stabilized',
];

const nextMilestones = [
  'Pilot pathway templates for two launch domains',
  'Source-quality review checklist automation',
  'Outcome measurement dashboard for grant reporting',
  'Institutional content governance workflow draft',
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="panel p-8">
        <h1 className="text-3xl leading-tight sm:text-4xl">Program Status</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-700 sm:text-base">
          NovaSanctum is in Alignment Phase 2: institutional hardening and pathway build-out. The
          objective is clear public credibility, mission fidelity, and grant-review readiness.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Open Resource Navigator
          </Link>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Governance Baseline</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {governance.map(item => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Engineering Baseline</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {engineering.map(item => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Next Milestones</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {nextMilestones.map(item => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
