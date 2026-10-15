import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** Pulls its child gently towards the cursor (mouse/pen only). */
export default function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.span ref={ref} style={{ x, y, display: 'inline-block' }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
