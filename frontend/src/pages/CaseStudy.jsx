import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { usePageMeta } from '../hooks/usePageMeta';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal';
import { ProjectCard, ApiState } from '../components/ui/Cards';
import FallbackOrb from '../components/three/FallbackOrb';
import CtaBanner from '../components/sections/CtaBanner';
import NotFound from './NotFound';

const CaseStudyScene = lazy(() => import('../components/three/CaseStudyScene'));

/** ONE reusable case-study template. `presentation: "3d"` in the data unlocks the interactive viewer. */
export default function CaseStudy() {
  const { slug } = useParams();
  const { data: p, loading, error } = useApi(`/projects/${slug}`);
  const { data: services } = useApi('/services');
  usePageMeta(p?.title, p?.summary);
  if (error?.status === 404) return <NotFound />;

  const [a, b] = p?.gradient || ['#D4AF37', '#000'];
  const related = (services || []).filter((s) => p?.services?.includes(s.slug));

  return (
    <ApiState loading={loading} error={error} skeleton={<div className="min-h-screen" />}>
      {p && (
        <>
          <section className="relative overflow-hidden pb-16 pt-40 md:pt-48" style={{ background: `radial-gradient(90% 70% at 15% 0%, ${a}30, transparent 70%)` }}>
            <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
            <div className="container-x relative">
              <Link to="/portfolio" className="text-sm text-zinc-400 hover:text-gold">← All projects</Link>
              <p className="eyebrow mt-6">{p.industry}</p>
              <h1 className="h-display mt-4 text-5xl md:text-7xl">{p.title}</h1>
              <p className="mt-6 max-w-2xl text-lg text-zinc-300">{p.summary}</p>
              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-6 border-t border-white/10 pt-8 text-sm sm:grid-cols-3">
                <div><dt className="text-zinc-500">Client</dt><dd className="mt-1 text-white">{p.client}</dd></div>
                <div><dt className="text-zinc-500">Industry</dt><dd className="mt-1 text-white">{p.industry}</dd></div>
                <div><dt className="text-zinc-500">Year</dt><dd className="mt-1 text-white">{p.year}</dd></div>
              </dl>
            </div>
          </section>

          {/* Visuals */}
          <section className="container-x">
            {p.presentation === '3d' ? (
              <div className="glass-gold h-[460px] overflow-hidden rounded-[2rem] md:h-[600px]">
                <Suspense fallback={<FallbackOrb />}><CaseStudyScene className="h-full w-full" /></Suspense>
              </div>
            ) : (
              <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] border border-white/10" style={{ background: `radial-gradient(120% 90% at 20% 10%, ${a}66 0%, ${b} 70%)` }}>
                <div className="absolute inset-0 grid-bg opacity-40" />
                <p className="absolute bottom-6 left-8 font-display text-3xl text-white/80">{p.title}</p>
              </div>
            )}
          </section>

          <section className="section">
            <div className="container-x grid gap-8 md:grid-cols-2">
              <Reveal><div className="glass h-full rounded-3xl p-8 md:p-10"><p className="eyebrow">The challenge</p><p className="mt-5 text-lg leading-relaxed text-zinc-200">{p.challenge}</p></div></Reveal>
              <Reveal delay={0.1}><div className="glass-gold h-full rounded-3xl p-8 md:p-10"><p className="eyebrow">Our solution</p><p className="mt-5 text-lg leading-relaxed text-zinc-200">{p.solution}</p></div></Reveal>
            </div>
          </section>

          <section className="section border-y border-white/10 bg-ink-900 py-20 md:py-24">
            <div className="container-x">
              <SectionHeading eyebrow="Results" title="Measurable impact." />
              <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
                {p.results.map((r) => (
                  <RevealItem key={r.label}><div className="rounded-3xl border border-white/10 bg-black/40 p-8"><p className="text-gold-gradient font-display text-6xl font-bold">{r.value}</p><p className="mt-2 text-zinc-400">{r.label}</p></div></RevealItem>
                ))}
              </RevealGroup>
              <div className="mt-14">
                <p className="text-xs uppercase tracking-[.25em] text-zinc-500">Technologies</p>
                <div className="mt-4 flex flex-wrap gap-3">{p.technologies.map((t) => <span key={t} className="rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold-100">{t}</span>)}</div>
                <p className="mt-10 text-xs uppercase tracking-[.25em] text-zinc-500">Related services</p>
                <div className="mt-4 flex flex-wrap gap-3">{related.map((s) => <Link key={s.slug} to={`/services/${s.slug}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-gold hover:text-gold">{s.title} →</Link>)}</div>
              </div>
            </div>
          </section>

          {p.related?.length > 0 && (
            <section className="section">
              <div className="container-x">
                <SectionHeading eyebrow="Keep exploring" title="More case studies." />
                <div className="mt-12 grid gap-6 md:grid-cols-2">{p.related.map((r, i) => <ProjectCard key={r.slug} project={r} index={i} />)}</div>
                <div className="mt-10"><Button to="/portfolio" variant="ghost">All projects</Button></div>
              </div>
            </section>
          )}
          <CtaBanner title="Want results like these?" />
        </>
      )}
    </ApiState>
  );
}
