import { useApi } from '../../hooks/useApi';
import SectionHeading from '../ui/SectionHeading';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { ServiceCard, ApiState, Skeleton } from '../ui/Cards';

export default function ServicesShowcase() {
  const { data, loading, error } = useApi('/services');
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow="What we do" title="Six disciplines. One growth partner." text="Every service is delivered by a focused team and connected to the same strategy, design system and data." />
        <div className="mt-16">
          <ApiState loading={loading} error={error} skeleton={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80" />)}</div>}>
            <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data?.map((s, i) => <RevealItem key={s.slug}><ServiceCard service={s} index={i} /></RevealItem>)}
            </RevealGroup>
          </ApiState>
        </div>
      </div>
    </section>
  );
}
