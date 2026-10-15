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

const ServiceScene = lazy(() => import('../components/three/ServiceScene'));

/** ONE reusable template powers all six service pages — content comes from the services table. */
export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: s, loading, error } = useApi(`/services/${slug}`);
  const { data: projects } = useApi(`/projects?service=${slug}`);
  usePageMeta(s?.title, s?.short);

  if (error?.status === 404) return <NotFound />;
  return (
    <ApiState loading={loading} error={error} skeleton={<div className="min-h-screen" />}>
      {s && (
        <>
          <section className="relative flex min-h-[88svh] items-center overflow-hidden pt-28">
            <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
            <div className="container-x relative grid items-center gap-8 lg:grid-cols-2">
              <div className="relative z-10">
                <Link to="/services" className="text-sm text-zinc-400 hover:text-gold">← All services</Link>
                <p className="eyebrow mt-6">{s.tagline}</p>
                <h1 className="h-display mt-4 text-5xl md:text-7xl">{s.title}</h1>
                <p className="mt-6 max-w-xl text-lg text-zinc-300">{s.short}</p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Button to={`/contact?intent=quote&service=${s.slug}`}>Get a Quote</Button>
                  <Button to="/portfolio" variant="ghost">See our work</Button>
                </div>
              </div>
              <div className="relative h-[360px] sm:h-[460px] lg:h-[560px]">
                <Suspense fallback={<FallbackOrb />}><ServiceScene variant={s.visual} className="h-full w-full" /></Suspense>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container-x grid gap-8 md:grid-cols-2">
              <Reveal><div className="glass h-full rounded-3xl p-8 md:p-10"><p className="eyebrow">The problem</p><p className="mt-5 font-display text-2xl leading-snug text-white">{s.problem}</p></div></Reveal>
              <Reveal delay={0.1}><div className="glass-gold h-full rounded-3xl p-8 md:p-10"><p className="eyebrow">Our solution</p><p className="mt-5 font-display text-2xl leading-snug text-white">{s.solution}</p></div></Reveal>
            </div>
          </section>

          <section className="section pt-0">
            <div className="container-x">
              <SectionHeading eyebrow="Key features" title="What you get." />
              <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {s.features.map((f) => (
                  <RevealItem key={f}><div className="glass flex items-start gap-3 rounded-2xl p-5"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" /><span className="text-zinc-200">{f}</span></div></RevealItem>
                ))}
              </RevealGroup>
            </div>
          </section>

          <section className="section border-y border-white/10 bg-ink-900">
            <div className="container-x grid gap-16 lg:grid-cols-2">
              <div>
                <SectionHeading eyebrow="Industry use cases" title="Built for real businesses." />
                <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
                  {s.useCases.map((u) => <li key={u} className="py-4 font-display text-xl text-white">{u}</li>)}
                </ul>
              </div>
              <div>
                <SectionHeading eyebrow="Technology stack" title="Tools we trust." />
                <div className="mt-10 flex flex-wrap gap-3">
                  {s.stack.map((t) => <span key={t} className="rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold-100">{t}</span>)}
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container-x">
              <SectionHeading eyebrow="Process" title="How we deliver." />
              <RevealGroup className="mt-12 grid gap-4 md:grid-cols-4">
                {s.process.map((p, i) => (
                  <RevealItem key={p.title}><div className="glass h-full rounded-2xl p-6"><span className="font-display text-4xl text-gold/60">0{i + 1}</span><h3 className="mt-3 font-display text-xl text-white">{p.title}</h3><p className="mt-2 text-sm text-zinc-400">{p.text}</p></div></RevealItem>
                ))}
              </RevealGroup>
            </div>
          </section>

          {projects?.length > 0 && (
            <section className="section pt-0">
              <div className="container-x">
                <SectionHeading eyebrow="Related portfolio" title={`${s.title} in action.`} />
                <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
                  {projects.slice(0, 3).map((p, i) => <RevealItem key={p.slug}><ProjectCard project={p} index={i} /></RevealItem>)}
                </RevealGroup>
              </div>
            </section>
          )}
          <CtaBanner title={`Let's talk ${s.title.toLowerCase()}.`} cta="Get a Quote" to={`/contact?intent=quote&service=${s.slug}`} />
        </>
      )}
    </ApiState>
  );
}
