import Link from 'next/link';

export const metadata = {
  title: 'Program Status - NovaSanctum',
  description: 'Current institutional reorientation status for NovaSanctum open learning pathways.',
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Program Status</h1>
      <p className="mt-4 text-slate-700">
        NovaSanctum is in an active strategic reorientation to align all public surfaces with its
        nonprofit educational mission.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-slate-700">
        <li>Mission and governance policy documents are now established.</li>
        <li>Off-mission public routes are disabled.</li>
        <li>Legacy integration summaries are archived.</li>
        <li>Search and pathway infrastructure is being refit for open educational resources.</li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/search"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Open Resource Search
        </Link>
      </div>
    </main>
  );
}
