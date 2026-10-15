import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import SceneCanvas, { useTier } from './SceneCanvas';
import FallbackOrb from './FallbackOrb';
import { fibonacciSphere } from './HeroScene';

function Constellation({ items, onSelect, active }) {
  const ref = useRef();
  const tier = useTier();
  const pts = useMemo(() => fibonacciSphere(items.length, 2.6), [items.length]);
  const lines = useMemo(() => {
    const v = [];
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && a.distanceTo(b) < 2.7) v.push(a.x, a.y, a.z, b.x, b.y, b.z); }));
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); return g;
  }, [pts]);

  useFrame((_, dt) => { if (!active) ref.current.rotation.y += dt * 0.1; });

  return (
    <group ref={ref}>
      <mesh><sphereGeometry args={[1.1, 32, 32]} /><meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.28} /></mesh>
      <mesh><sphereGeometry args={[2.6, 24, 24]} /><meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.06} /></mesh>
      <lineSegments geometry={lines}><lineBasicMaterial color="#D4AF37" transparent opacity={0.25} /></lineSegments>
      {items.map((t, i) => (
        <group key={t.name} position={pts[i]}>
          <mesh><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color={active === t.name ? '#fff' : '#D4AF37'} /></mesh>
          <Html center distanceFactor={tier === 'high' ? 9 : 11} zIndexRange={[10, 0]} style={{ pointerEvents: 'auto' }}>
            <button onClick={() => onSelect(t.name)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium backdrop-blur transition ${active === t.name ? 'border-gold bg-gold text-black' : 'border-white/20 bg-black/60 text-white hover:border-gold'}`}>
              {t.name}
            </button>
          </Html>
        </group>
      ))}
    </group>
  );
}

/** Drag to rotate; click a technology to inspect it. */
export default function TechConstellation({ items, onSelect, active, className }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 8.5], fov: 45 }} fallback={<FallbackOrb label="Technology constellation" />}>
      <Constellation items={items} onSelect={onSelect} active={active} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} autoRotate={!active} autoRotateSpeed={0.8} />
    </SceneCanvas>
  );
}
