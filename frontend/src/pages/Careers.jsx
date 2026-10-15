import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHero from '../components/ui/PageHero';
import { ApiState, Skeleton } from '../components/ui/Cards';

const Select = ({ label, value, onChange, options }) => (
  <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="field max-w-[220px] bg-ink-800">
    <option value="">{label}</option>
    {options?.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

export default function Careers() {
  usePageMeta('Careers', 'Join Riyadvi Software Technologies — open roles in engineering, design and marketing.');
  const [f, setF] = useState({ department: '', designation: '', experience: '' });
  const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
  const { data, loading, error } = useApi(`/jobs${qs ? `?${qs}` : ''}`);

  return (
    <>
      <PageHero eyebrow="Careers" title="Build premium products with us." text="We are a small, ambitious team that cares about craft. Find a role that fits." />
      <section className="container-x pb-24">
        <div className="mb-10 flex flex-wrap gap-3">
          <Select label="All departments" value={f.department} onChange={(v) => setF({ ...f, department: v })} options={data?.filters.departments} />
          <Select label="All designations" value={f.designation} onChange={(v) => setF({ ...f, designation: v })} options={data?.filters.designations} />
          <Select label="Any experience" value={f.experience} onChange={(v) => setF({ ...f, experience: v })} options={data?.filters.experiences} />
        </div>
        <ApiState loading={loading} error={error} skeleton={<div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>}>
          <div className="space-y-4">
            {data?.jobs.map((j) => (
              <motion.div key={j.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ x: 6 }}>
                <Link to={`/careers/${j.slug}`} className="glass group flex flex-col justify-between gap-4 rounded-2xl p-6 transition hover:border-gold/50 md:flex-row md:items-center">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{j.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{j.summary}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs">
                    {[j.department, j.experience, j.type, j.location].map((t) => <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-zinc-300">{t}</span>)}
                    <span className="text-gold transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            {data?.jobs.length === 0 && <p className="text-zinc-400">No openings match these filters.</p>}
          </div>
        </ApiState>
        <p className="mt-10 text-sm text-zinc-500">Don't see your role? Email your profile via the <Link to="/contact" className="text-gold hover:underline">contact page</Link>.</p>
      </section>
    </>
  );
}
