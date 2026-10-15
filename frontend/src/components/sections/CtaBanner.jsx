import { Reveal } from '../ui/Reveal';
import Button from '../ui/Button';

export default function CtaBanner({ title = 'Ready to build something remarkable?', text = 'Tell us about your goals — we will reply within one business day.', cta = 'Book a Free Consultation', to = '/contact?intent=consultation' }) {
  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 bg-gradient-to-br from-gold/20 via-ink-800 to-black p-10 text-center md:p-20">
            <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
            <div className="absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-gold/30 blur-[100px]" aria-hidden />
            <h2 className="h-display relative mx-auto max-w-3xl text-4xl md:text-6xl">{title}</h2>
            <p className="relative mx-auto mt-5 max-w-xl text-zinc-300">{text}</p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <Button to={to}>{cta}</Button>
              <Button to="/business-health-checkup" variant="ghost">Take the Health Checkup</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
