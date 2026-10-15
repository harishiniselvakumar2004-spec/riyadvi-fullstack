import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHero from '../components/ui/PageHero';
import { ProjectCard, ApiState, Skeleton } from '../components/ui/Cards';
import CtaBanner from '../components/sections/CtaBanner';

export default function Portfolio() {
  usePageMeta('Portfolio', 'Selected case studies from Riyadvi Software Technologies.');
  const { data, loading, error } = useApi('/projects');
  const [filter, setFilter] = useState('All');
  const industries = useMemo(() => ['All', ...new Set((data || []).map((p) => p.industry))], [data]);
  const shown = (data || []).filter((p) => filter === 'All' || p.industry === filter);

  return (
    <>
      <PageHero eyebrow="Portfolio" title="Work that moves the needle." text="A selection of projects across healthcare, retail, real estate, AI and more." />
      <section className="container-x pb-12">
        <div className="mb-10 flex flex-wrap gap-2">
          {industries.map((i) => (
            <button key={i} onClick={() => setFilter(i)} className={`rounded-full border px-4 py-2 text-sm transition ${filter === i ? 'border-gold bg-gold text-black' : 'border-white/15 text-zinc-300 hover:border-gold/50'}`}>{i}</button>
          ))}
        </div>
        <ApiState loading={loading} error={error} skeleton={<div className="grid gap-6 md:grid-cols-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-96" />)}</div>}>
          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35 }}>
                  <ProjectCard project={p} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </ApiState>
      </section>
      <CtaBanner />
    </>
  );
}
