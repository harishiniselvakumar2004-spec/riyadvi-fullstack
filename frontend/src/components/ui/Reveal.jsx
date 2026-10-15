import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/** Scroll-triggered fade/slide. */
export function Reveal({ children, delay = 0, y = 32, className = '' }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

const group = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

export const RevealGroup = ({ children, className = '' }) => (
  <motion.div className={className} variants={group} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>{children}</motion.div>
);
export const RevealItem = ({ children, className = '' }) => <motion.div className={className} variants={item}>{children}</motion.div>;

/** Splits a heading into words that rise into place. */
export function SplitText({ text, className = '', delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom" aria-hidden>
          <motion.span className="inline-block" initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </span>
  );
}
