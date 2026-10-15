import { Reveal, SplitText } from './Reveal';

export default function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 md:pt-48">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div className="absolute left-1/2 top-0 h-72 w-[620px] -translate-x-1/2 rounded-full bg-gold/10 blur-[110px]" aria-hidden />
      <div className="container-x relative">
        {eyebrow && <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>}
        <h1 className="h-display mt-5 max-w-4xl text-5xl md:text-7xl"><SplitText text={title} /></h1>
        {text && <Reveal delay={0.25}><p className="mt-6 max-w-2xl text-lg text-zinc-400">{text}</p></Reveal>}
        {children}
      </div>
    </section>
  );
}
