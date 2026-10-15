import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Riyadvi home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold font-display text-lg font-bold text-black transition-transform duration-500 group-hover:rotate-[360deg]">R</span>
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        RIYADVI<span className="text-gold">.</span>
        <span className="ml-2 hidden text-[10px] font-medium uppercase tracking-[.25em] text-zinc-500 sm:inline">Software Technologies</span>
      </span>
    </Link>
  );
}
