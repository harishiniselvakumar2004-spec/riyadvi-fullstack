import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import Button from '../ui/Button';

const LINKS = [
  { to: '/services', label: 'Services' }, { to: '/portfolio', label: 'Portfolio' }, { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' }, { to: '/careers', label: 'Careers' }, { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? 'border-b border-white/10 bg-black/70 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="container-x flex items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `relative rounded-full px-4 py-2 text-sm transition-colors ${isActive ? 'text-gold' : 'text-zinc-300 hover:text-white'}`}>
              {({ isActive }) => (<>{l.label}{isActive && <motion.span layoutId="nav-dot" className="absolute inset-x-4 -bottom-0.5 h-px bg-gold" />}</>)}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block"><Button to="/contact?intent=consultation" className="!py-2.5">Book a Consultation</Button></div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-white/15 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
          <span className="relative block h-3.5 w-5">
            <span className={`absolute left-0 h-px w-5 bg-white transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-1.5 h-px w-5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-px w-5 bg-white transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '100vh' }} exit={{ opacity: 0, height: 0 }} className="container-x overflow-hidden lg:hidden" aria-label="Mobile">
            <ul className="space-y-1 pt-8">
              {[{ to: '/', label: 'Home' }, ...LINKS].map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `block border-b border-white/10 py-4 font-display text-3xl ${isActive ? 'text-gold' : 'text-white'}`}>{l.label}</NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8"><Button to="/contact?intent=consultation" magnetic={false} className="w-full">Book a Free Consultation</Button></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
