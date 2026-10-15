import { Link } from 'react-router-dom';
import Logo from './Logo';

const COLS = [
  { title: 'Services', links: [['Web Development', '/services/web-development'], ['App Development', '/services/app-development'], ['Digital Marketing', '/services/digital-marketing'], ['AR / VR', '/services/ar-vr'], ['3D Modeling', '/services/3d-modeling'], ['UI/UX Design', '/services/ui-ux-design']] },
  { title: 'Company', links: [['About', '/about'], ['Portfolio', '/portfolio'], ['Blog', '/blog'], ['Careers', '/careers'], ['Contact', '/contact']] },
  { title: 'Resources', links: [['Business Health Checkup', '/business-health-checkup'], ['Project Planning Guide', '/software-project-planning-guide'], ['Get a Quote', '/contact?intent=quote']] },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-900">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-400">A technology & digital solutions partner combining engineering, design and business thinking to help brands grow.</p>
          <Link to="/contact?intent=consultation" className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">Start a project →</Link>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[.25em] text-zinc-500">{c.title}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {c.links.map(([label, to]) => <li key={to}><Link to={to} className="text-zinc-300 transition hover:text-gold">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-3 py-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Riyadvi Software Technologies. All rights reserved.</p>
          <Link to="/admin" className="hover:text-gold">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
