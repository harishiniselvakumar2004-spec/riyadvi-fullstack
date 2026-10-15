import { motion } from 'framer-motion';

const G = '#D4AF37';
const loop = (d = 3, delay = 0) => ({ duration: d, delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' });

/** Lightweight animated SVG per service — used on cards so we don't need 6 WebGL contexts on the home page. */
const VISUALS = {
  web: () => (
    <g>
      <rect x="20" y="22" width="160" height="104" rx="10" fill="#0b0b0d" stroke="#333" />
      <rect x="20" y="22" width="160" height="16" rx="10" fill="#1a1a1d" />
      {[30, 38, 46].map((x, i) => <circle key={x} cx={x} cy="30" r="2.5" fill={i ? '#555' : G} />)}
      <motion.rect x="32" y="50" width="52" height="34" rx="4" fill={G} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={loop(2)} />
      {[52, 64, 76].map((y, i) => <motion.rect key={y} x="94" y={y} height="6" rx="3" fill="#3a3a40" initial={{ width: 20 }} animate={{ width: 70 }} transition={loop(2.4, i * 0.3)} />)}
      <motion.path d="M150 100l10 14 3-7 7-3z" fill="#fff" animate={{ x: [-60, 0, -30], y: [-30, 0, -10] }} transition={{ duration: 5, repeat: Infinity }} />
    </g>
  ),
  app: () => (
    <g>
      <rect x="68" y="12" width="64" height="124" rx="14" fill="#0b0b0d" stroke={G} strokeWidth="2" />
      {[28, 62, 96].map((y, i) => <motion.rect key={y} x="76" y={y} width="48" height="26" rx="6" fill={G} initial={{ opacity: 0.25 }} animate={{ opacity: 0.95 }} transition={loop(1.6, i * 0.35)} />)}
      <motion.circle cx="100" cy="128" r="3" fill="#fff" animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 2, repeat: Infinity }} />
    </g>
  ),
  marketing: () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <motion.rect key={i} x={30 + i * 30} width="18" rx="3" fill={G} fillOpacity={0.35 + i * 0.13}
        initial={{ y: 120, height: 8 }} animate={{ y: 120 - (20 + i * 17), height: 20 + i * 17 }} transition={loop(2, i * 0.2)} />)}
      <motion.path d="M26 104 L58 88 L88 94 L118 62 L150 48 L176 22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1 }} />
    </g>
  ),
  arvr: () => (
    <g>
      <rect x="52" y="54" width="96" height="42" rx="18" fill="#0b0b0d" stroke={G} strokeWidth="2" />
      <motion.rect x="62" y="64" width="76" height="22" rx="10" fill={G} animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }} />
      {[0, 1].map((i) => <motion.ellipse key={i} cx="100" cy="75" rx={62 + i * 18} ry={22 + i * 8} fill="none" stroke={G} strokeOpacity={0.5 - i * 0.2}
        animate={{ rotate: i ? -360 : 360 }} transition={{ duration: 14 + i * 8, repeat: Infinity, ease: 'linear' }} style={{ originX: '100px', originY: '75px' }} />)}
    </g>
  ),
  model: () => (
    <motion.g animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} style={{ originX: '100px', originY: '75px' }}>
      <polygon points="100,26 146,50 146,100 100,124 54,100 54,50" fill="none" stroke={G} strokeWidth="2" />
      <path d="M54 50 L100 74 L146 50 M100 74 L100 124" fill="none" stroke={G} strokeOpacity="0.7" strokeWidth="1.5" />
      <polygon points="100,74 146,50 146,100 100,124" fill={G} fillOpacity="0.18" />
    </motion.g>
  ),
  uiux: () => (
    <g>
      {[[30, 30, 70, 40, 1], [96, 52, 70, 54, 0.35], [44, 92, 90, 30, 0.6]].map(([x, y, w, h, o], i) => (
        <motion.rect key={i} x={x} y={y} width={w} height={h} rx="8" fill={i === 0 ? G : '#1d1d22'} stroke={G} strokeOpacity={o}
          animate={{ y: [y, y - 8, y], x: [x, x + (i % 2 ? -4 : 4), x] }} transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </g>
  ),
};

export default function ServiceVisual({ variant = 'web', className = '' }) {
  const V = VISUALS[variant] || VISUALS.web;
  return <svg viewBox="0 0 200 150" className={className} role="img" aria-label={`${variant} illustration`}><V /></svg>;
}
