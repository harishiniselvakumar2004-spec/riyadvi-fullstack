import { Reveal, SplitText } from './Reveal';

export default function SectionHeading({ eyebrow, title, text, align = 'left', className = '' }) {
  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>}
      <h2 className="h-display mt-5 text-4xl md:text-6xl"><SplitText text={title} /></h2>
      {text && <Reveal delay={0.2}><p className="mt-6 text-lg leading-relaxed text-zinc-400">{text}</p></Reveal>}
    </div>
  );
}
