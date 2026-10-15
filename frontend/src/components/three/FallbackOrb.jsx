/** Lightweight CSS stand-in for any 3D scene (static fallback / loading state). */
export default function FallbackOrb({ label }) {
  return (
    <div className="relative grid h-full min-h-[260px] w-full place-items-center" role="img" aria-label={label || 'Decorative technology orb'}>
      <div className="absolute h-[60%] max-h-[420px] aspect-square rounded-full opacity-90 blur-[1px]"
        style={{ background: 'radial-gradient(circle at 32% 28%, #f4e8b5 0%, #D4AF37 28%, #5b4710 62%, #000 100%)', boxShadow: '0 0 120px rgba(212,175,55,.35)' }} />
      {[1, 1.35, 1.7].map((s, i) => (
        <div key={i} className="absolute aspect-square rounded-full border border-gold/30 animate-[spin_linear_infinite]"
          style={{ height: `${48 * s}%`, animationDuration: `${24 + i * 14}s`, borderStyle: i === 1 ? 'dashed' : 'solid' }} />
      ))}
    </div>
  );
}
