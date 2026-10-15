import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STEPS } from '../../lib/content';
import SectionHeading from '../ui/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-pinned storytelling (GSAP ScrollTrigger + Lenis).
 * Desktop: section pins and scroll progress advances the six stages.
 * Mobile: no pinning — stages stack vertically (cheaper & friendlier to touch scrolling).
 */
export default function TransformationStory() {
  const root = useRef(null);
  const bar = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: `+=${STEPS.length * 75}%`, pin: true, scrub: true,
        onUpdate: (self) => {
          setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
          gsap.set(bar.current, { scaleY: self.progress });
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  const step = STEPS[active];

  return (
    <section ref={root} className="relative overflow-hidden border-y border-white/10 bg-ink-900 lg:flex lg:min-h-screen lg:items-center">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div className="container-x section relative grid items-center gap-12 lg:grid-cols-2 lg:py-0">
        <div>
          <SectionHeading eyebrow="Digital transformation" title="From business challenge to sustained growth." text="A proven six-stage approach that turns uncertainty into a clear, measurable path forward." />
          <ol className="relative mt-12 space-y-1 pl-8">
            <span className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" aria-hidden />
            <span ref={bar} className="absolute bottom-2 left-[7px] top-2 hidden w-px origin-top scale-y-0 bg-gold lg:block" aria-hidden />
            {STEPS.map((s, i) => (
              <li key={s.key} className={`relative py-2.5 transition-all duration-500 ${i === active ? 'translate-x-2 text-white' : 'text-zinc-500'}`}>
                <span className={`absolute -left-[31px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border transition-all duration-500 ${i <= active ? 'border-gold bg-gold shadow-glow' : 'border-white/20 bg-black'}`} />
                <span className="font-display text-xl">{s.title}</span>
                <p className="mt-1 text-sm text-zinc-400 lg:hidden">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative hidden h-[460px] lg:block">
          <AnimatePresence mode="wait">
            <motion.div key={step.key} initial={{ opacity: 0, y: 40, rotateX: -12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }} className="glass-gold absolute inset-0 flex flex-col justify-between rounded-[2rem] p-10" style={{ transformPerspective: 1200 }}>
              <span className="font-display text-[10rem] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(212,175,55,.55)]">0{active + 1}</span>
              <div>
                <p className="eyebrow">{step.key}</p>
                <h3 className="mt-3 font-display text-4xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 max-w-md text-zinc-300">{step.text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
