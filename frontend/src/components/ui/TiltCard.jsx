import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/** 3D tilt + spotlight that follows the pointer. */
export default function TiltCard({ children, className = '', max = 8 }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5); const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 }); const sy = useSpring(py, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const spot = useTransform([sx, sy], ([x, y]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(212,175,55,.16), transparent 45%)`);
  const move = (e) => {
    if (e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { px.set(0.5); py.set(0.5); };
  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ rotateX, rotateY, transformPerspective: 1000 }} className={`relative ${className}`}>
      <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: spot }} />
      {children}
    </motion.div>
  );
}
