import { usePageMeta } from '../hooks/usePageMeta';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import { RevealGroup, RevealItem, Reveal } from '../components/ui/Reveal';
import TiltCard from '../components/ui/TiltCard';
import { Timeline } from '../components/sections/WhyRiyadvi';
import CtaBanner from '../components/sections/CtaBanner';
import { VALUES } from '../lib/content';

export default function About() {
  usePageMeta('About', 'Riyadvi Software Technologies — founded in 2021 as a technology and digital solutions partner.');
  return (
    <>
      <PageHero eyebrow="About Riyadvi" title="Founded in 2021 to be a partner, not a vendor." text="We combine engineering, design and business thinking to help ambitious brands grow." />
      <section className="section pt-8">
        <div className="container-x grid gap-8 md:grid-cols-2">
          <Reveal><div className="glass-gold h-full rounded-3xl p-8 md:p-10"><p className="eyebrow">Our vision</p><p className="mt-5 font-display text-2xl leading-snug text-white">To be the most trusted technology partner for growing businesses.</p></div></Reveal>
          <Reveal delay={0.1}><div className="glass h-full rounded-3xl p-8 md:p-10"><p className="eyebrow">Our mission</p><p className="mt-5 font-display text-2xl leading-snug text-white">Deliver premium digital products that are fast, useful and built to last.</p></div></Reveal>
        </div>
      </section>
      <section className="section border-y border-white/10 bg-ink-900">
        <div className="container-x">
          <SectionHeading eyebrow="Our story" title="Milestones along the way." align="center" />
          <div className="mt-20"><Timeline /></div>
        </div>
      </section>
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Values" title="What we stand for." />
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <RevealItem key={v.title}><TiltCard className="h-full rounded-3xl"><div className="glass h-full rounded-3xl p-7"><span className="font-display text-4xl text-gold/50">0{i + 1}</span><h3 className="mt-4 font-display text-xl text-white">{v.title}</h3><p className="mt-2 text-sm text-zinc-400">{v.text}</p></div></TiltCard></RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <section className="section pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Recognition" title="Trusted by our clients." text="Awards and certifications will be showcased here as they are confirmed by the team." />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
