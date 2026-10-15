import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import SectionHeading from '../ui/SectionHeading';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { ProjectCard, ApiState, Skeleton } from '../ui/Cards';

export default function PortfolioPreview() {
  const { data, loading, error } = useApi('/projects');
  const featured = data?.filter((p) => p.featured).slice(0, 3) || [];
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Selected work" title="Results our clients can feel." />
          <Link to="/portfolio" className="text-sm font-semibold text-gold hover:underline">View all projects →</Link>
        </div>
        <div className="mt-14">
          <ApiState loading={loading} error={error} skeleton={<div className="grid gap-6 md:grid-cols-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96" />)}</div>}>
            <RevealGroup className="grid gap-6 md:grid-cols-3">
              {featured.map((p, i) => <RevealItem key={p.slug}><ProjectCard project={p} index={i} /></RevealItem>)}
            </RevealGroup>
          </ApiState>
        </div>
      </div>
    </section>
  );
}
