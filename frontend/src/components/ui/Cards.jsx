import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';
import ServiceVisual from './ServiceVisual';

export function ServiceCard({ service, index }) {
  return (
    <TiltCard className="h-full rounded-3xl">
      <Link to={`/services/${service.slug}`} className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-colors hover:border-gold/50">
        <span className="font-display text-sm text-gold/70">{String(index + 1).padStart(2, '0')}</span>
        <ServiceVisual variant={service.visual} className="mx-auto my-4 h-36 w-full max-w-[220px] transition-transform duration-700 group-hover:scale-110" />
        <h3 className="font-display text-2xl font-semibold text-white">{service.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{service.short}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">Explore <span className="transition-transform group-hover:translate-x-1.5">→</span></span>
      </Link>
    </TiltCard>
  );
}

export function ProjectCard({ project, index = 0, large = false }) {
  const [a, b] = project.gradient || ['#D4AF37', '#000'];
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} className="h-full">
      <Link to={`/portfolio/${project.slug}`} className="group relative block h-full overflow-hidden rounded-3xl border border-white/10">
        <div className={`relative ${large ? 'aspect-[16/10]' : 'aspect-[4/3]'} overflow-hidden`} style={{ background: `radial-gradient(120% 90% at 20% 10%, ${a}55 0%, ${b} 70%)` }}>
          <div className="absolute inset-0 grid-bg opacity-40" />
          <span className="absolute -bottom-6 -right-2 select-none font-display text-[9rem] font-bold leading-none text-white/[.07] transition-transform duration-700 group-hover:-translate-y-3">{String(index + 1).padStart(2, '0')}</span>
          {project.presentation === '3d' && <span className="absolute left-4 top-4 rounded-full border border-gold/50 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold backdrop-blur">Interactive 3D</span>}
        </div>
        <div className="bg-ink-800 p-6">
          <p className="text-xs uppercase tracking-[.2em] text-gold/80">{project.industry}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-white">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{project.summary}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-gold">View case study <span className="inline-block transition-transform group-hover:translate-x-1.5">→</span></span>
        </div>
      </Link>
    </motion.div>
  );
}

export const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-2xl bg-white/[.05] ${className}`} />;

export function ApiState({ loading, error, children, skeleton }) {
  if (loading) return skeleton || <Skeleton className="h-64 w-full" />;
  if (error) return <p className="glass rounded-2xl p-6 text-sm text-red-300" role="alert">{error.message} Make sure the backend is running.</p>;
  return children;
}
