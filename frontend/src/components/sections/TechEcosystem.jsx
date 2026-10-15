import { lazy, Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TECH } from '../../lib/content';
import SectionHeading from '../ui/SectionHeading';
import FallbackOrb from '../three/FallbackOrb';

const TechConstellation = lazy(() => import('../three/TechConstellation'));

export default function TechEcosystem() {
  const [active, setActive] = useState(null);
  const tech = TECH.find((t) => t.name === active);
  return (
    <section className="section overflow-hidden">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Technology ecosystem" title="A connected stack, built to scale." text="Pick a node — our constellation is interactive. Drag to rotate, click any technology to see how we use it." />
          <div className="mt-8 min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.div key={active || 'none'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-gold rounded-2xl p-6">
                {tech ? (<><p className="text-xs uppercase tracking-[.25em] text-gold">{tech.cat}</p><h3 className="mt-1 font-display text-2xl text-white">{tech.name}</h3><p className="mt-2 text-sm text-zinc-300">{tech.text}</p></>)
                  : <p className="text-sm text-zinc-300">Select a technology on the sphere to explore it.</p>}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Accessible list alternative + touch fallback */}
          <ul className="mt-6 flex flex-wrap gap-2 lg:hidden">
            {TECH.map((t) => <li key={t.name}><button onClick={() => setActive(t.name)} className={`rounded-full border px-3 py-1 text-xs ${active === t.name ? 'border-gold bg-gold text-black' : 'border-white/15 text-zinc-300'}`}>{t.name}</button></li>)}
          </ul>
        </div>
        <div className="relative h-[420px] sm:h-[520px]">
          <Suspense fallback={<FallbackOrb />}>
            <TechConstellation items={TECH} active={active} onSelect={(n) => setActive((a) => (a === n ? null : n))} className="h-full w-full" />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
