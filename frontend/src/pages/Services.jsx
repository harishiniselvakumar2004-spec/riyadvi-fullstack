import { useApi } from '../hooks/useApi';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHero from '../components/ui/PageHero';
import { RevealGroup, RevealItem } from '../components/ui/Reveal';
import { ServiceCard, ApiState, Skeleton } from '../components/ui/Cards';
import CtaBanner from '../components/sections/CtaBanner';

export default function Services() {
  usePageMeta('Services', 'Web development, app development, digital marketing, AR/VR, 3D modeling and UI/UX design.');
  const { data, loading, error } = useApi('/services');
  return (
    <>
      <PageHero eyebrow="Our services" title="Technology, design and growth under one roof." text="Six core disciplines, one connected team — from the first idea to measurable growth." />
      <section className="container-x pb-12">
        <ApiState loading={loading} error={error} skeleton={<div className="grid gap-6 md:grid-cols-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80" />)}</div>}>
          <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((s, i) => <RevealItem key={s.slug}><ServiceCard service={s} index={i} /></RevealItem>)}
          </RevealGroup>
        </ApiState>
      </section>
      <CtaBanner />
    </>
  );
}
