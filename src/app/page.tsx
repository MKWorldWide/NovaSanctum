import Link from 'next/link';

const pillars = [
  {
    title: 'Open Resource Curation',
    description:
      'We organize free textbooks, documentation, open courses, and public learning materials into usable collections.',
  },
  {
    title: 'Structured Learning Pathways',
    description:
      'We turn scattered resources into sequenced roadmaps with prerequisites, milestones, and applied outcomes.',
  },
  {
    title: 'Assistive AI Guidance',
    description:
      'AI supports navigation, pacing, and explanation while source materials remain the primary authority.',
  },
];

export default function Home() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          MK Worldwide Program
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          NovaSanctum: Open Learning Pathways
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
          NovaSanctum is an open online learning initiative that improves access to education by
          curating free resources and organizing them into practical, guided pathways.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          NovaSanctum complements formal education. It does not replace accredited institutions,
          instructors, or credential systems.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Explore Resources
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Program Status
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-14 md:grid-cols-3">
          {pillars.map(pillar => (
            <article
              key={pillar.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
