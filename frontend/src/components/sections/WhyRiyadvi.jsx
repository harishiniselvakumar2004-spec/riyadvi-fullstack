import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MILESTONES, END_TO_END } from '../../lib/content';
import SectionHeading from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import Button from '../ui/Button';

export function Timeline({ items = MILESTONES }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 50%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  return (
    <div ref={ref} className="relative mx-auto max-w-3xl">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-white/10 md:left-1/2" />
      <motion.div style={{ scaleY }} className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-gold to-gold/20 md:left-1/2" />
      {items.map((m, i) => (
        <motion.div key={m.year} initial={{ opacity: 0, x: i % 2 ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}
          className={`relative mb-12 pl-12 md:w-1/2 md:pl-0 ${i % 2 ? 'md:ml-auto md:pl-12' : 'md:pr-12 md:text-right'}`}>
          <span className={`absolute left-[9px] top-2 h-3.5 w-3.5 rounded-full border-2 border-gold bg-black shadow-glow md:left-auto ${i % 2 ? 'md:-left-[7px]' : 'md:-right-[7px]'}`} />
          <p className="font-display text-3xl font-semibold text-gold">{m.year}</p>
          <h3 className="mt-1 font-display text-xl text-white">{m.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{m.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function WhyRiyadvi() {
  return (
    <section className="section border-t border-white/10 bg-ink-900">
      <div className="container-x">
        <SectionHeading eyebrow="Why Riyadvi" title="Since 2021, a partner in your growth." align="center" />
        <div className="mt-20"><Timeline /></div>

        <div className="mt-24 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass-gold h-full rounded-3xl p-8 md:p-10">
              <p className="eyebrow">Business Health Checkup</p>
              <h3 className="mt-4 font-display text-3xl font-semibold text-white">Find your next digital growth opportunity.</h3>
              <p className="mt-4 text-zinc-300">A five-minute self-assessment covering your website, marketing, technology and operations — reviewed by our strategists, with a tailored action plan.</p>
              <div className="mt-8"><Button to="/business-health-checkup">Take the Free Checkup</Button></div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass h-full rounded-3xl p-8 md:p-10">
              <p className="eyebrow">End-to-end solutions</p>
              <h3 className="mt-4 font-display text-3xl font-semibold text-white">One team across the whole journey.</h3>
              <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {END_TO_END.map((s, i) => (
                  <motion.li key={s} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4"><span className="text-xs text-gold">0{i + 1}</span><p className="mt-1 font-display text-lg text-white">{s}</p></motion.li>
                ))}
              </ol>
              <Link to="/services" className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">See all services →</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
