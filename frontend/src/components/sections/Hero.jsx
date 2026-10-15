import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import FallbackOrb from '../three/FallbackOrb';

const HeroScene = lazy(() => import('../three/HeroScene'));

const EASE = [0.22, 1, 0.36, 1];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-gold/10 blur-[120px]" aria-hidden />

      {/* 3D layer: sits behind text on mobile, to the right on desktop */}
      <div className="absolute inset-0 lg:left-[38%]">
        <Suspense fallback={<FallbackOrb />}>
          <HeroScene className="h-full w-full" />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent lg:via-black/30" aria-hidden />

      <div className="container-x relative z-10">
        <div className="max-w-3xl">
          <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="eyebrow">
            Technology & Digital Solutions Partner · Since 2021
          </motion.span>
          <h1 className="h-display mt-6 text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-6xl">
            {['Custom Software &', 'Digital Solutions to'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: EASE }}>{line}</motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-2">
              <motion.span className="text-gold-gradient block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.4, ease: EASE }}>Grow Your Business</motion.span>
            </span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease: EASE }} className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-300">
            Web & App Development, UI/UX Design, and Business Strategy – all tailored to your needs.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85, ease: EASE }} className="mt-10 flex flex-wrap gap-4">
            <Button to="/contact?intent=consultation">Book a Free Consultation</Button>
            <Button to="/services" variant="ghost">Explore Our Solutions</Button>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[.3em] text-zinc-500 md:flex">
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/15"><motion.span className="absolute inset-x-0 top-0 h-4 bg-gold" animate={{ y: [-16, 40] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} /></span>
      </motion.div>
    </section>
  );
}
