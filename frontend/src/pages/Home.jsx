import Hero from '../components/sections/Hero';
import Marquee from '../components/ui/Marquee';
import TransformationStory from '../components/sections/TransformationStory';
import ServicesShowcase from '../components/sections/ServicesShowcase';
import TechEcosystem from '../components/sections/TechEcosystem';
import PortfolioPreview from '../components/sections/PortfolioPreview';
import WhyRiyadvi from '../components/sections/WhyRiyadvi';
import CtaBanner from '../components/sections/CtaBanner';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta('', 'Custom software, web & app development, UI/UX, AR/VR and digital growth — Riyadvi is your technology & digital solutions partner.');
  return (
    <>
      <Hero />
      <Marquee items={['Strategy', 'Design', 'Development', 'Marketing', 'Optimization', 'Growth']} />
      <ServicesShowcase />
      <TransformationStory />
      <TechEcosystem />
      <PortfolioPreview />
      <WhyRiyadvi />
      <CtaBanner />
    </>
  );
}
