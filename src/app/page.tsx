import Link from 'next/link';

const commitments = [
  {
    title: 'Open Resource Curation',
    detail:
      'Resources are selected from free and public sources with attribution, source transparency, and recurring review.',
  },
  {
    title: 'Structured Pathways',
    detail:
      'Learners receive sequenced roadmaps with clear entry points, intermediate milestones, and practical outcomes.',
  },
  {
    title: 'Assistive AI Guidance',
    detail:
      'AI supports navigation and explanation while cited source material remains the primary authority.',
  },
];

const launchDomains = [
  'Digital Foundations',
  'Web and Software Fundamentals',
  'Data Literacy',
  'AI Literacy and Responsible Use',
  'Career Readiness for Self-Directed Learners',
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <section className="panel overflow-hidden p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
          MK Worldwide Program
        </p>
        <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
          NovaSanctum: Open Learning Pathways
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          NovaSanctum expands access to education by curating free, public learning resources and
          organizing them into practical progression routes for self-directed learners.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          NovaSanctum complements formal education and does not replace accredited institutions,
          instructors, or credential systems.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Explore Resource Navigator
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            View Program Status
          </Link>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {commitments.map(item => (
          <article key={item.title} className="panel p-5">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 panel p-6 sm:p-8">
        <h2 className="text-2xl">Pilot Launch Domains</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          The first operational domain set is selected for grant legibility, practical workforce
          relevance, and high public-resource availability.
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {launchDomains.map(domain => (
            <li key={domain} className="rounded-md bg-slate-100 px-3 py-2">
              {domain}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
