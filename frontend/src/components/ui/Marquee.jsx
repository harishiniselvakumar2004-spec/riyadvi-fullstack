export default function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-2xl font-semibold text-white/30 md:text-4xl">{t}<span className="text-gold">✦</span></span>
        ))}
      </div>
    </div>
  );
}
