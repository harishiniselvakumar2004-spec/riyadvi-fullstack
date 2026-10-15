import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import SceneCanvas, { TierSparkles, useTier } from './SceneCanvas';
import FallbackOrb from './FallbackOrb';

const GOLD = '#D4AF37';

/** Evenly spaced points on a sphere (fibonacci lattice). */
export function fibonacciSphere(n, radius) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push(new THREE.Vector3(Math.cos(t) * r * radius, y * radius, Math.sin(t) * r * radius));
  }
  return pts;
}

function Ecosystem() {
  const tier = useTier();
  const group = useRef();
  const core = useRef();
  const [hover, setHover] = useState(false);
  const count = tier === 'high' ? 42 : 20;

  const { nodes, lineGeo } = useMemo(() => {
    const nodes = fibonacciSphere(count, 2.4).map((p, i) => p.multiplyScalar(0.85 + ((i * 37) % 10) / 33));
    const verts = [];
    nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && a.distanceTo(b) < (tier === 'high' ? 1.65 : 2.1)) verts.push(a.x, a.y, a.z, b.x, b.y, b.z); }));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return { nodes, lineGeo: geo };
  }, [count, tier]);

  const scrollY = useRef(0);
  if (typeof window !== 'undefined') scrollY.current = window.scrollY;

  useFrame((state, dt) => {
    const { pointer } = state;
    // cursor parallax + gentle auto-rotation + scroll-driven twist
    group.current.rotation.y += dt * 0.12;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.45 + scrollY.current * 0.0006, 3, dt);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, pointer.x * 0.5, 3, dt);
    core.current.rotation.y -= dt * 0.35;
    const s = THREE.MathUtils.damp(core.current.scale.x, hover ? 1.18 : 1, 6, dt);
    core.current.scale.setScalar(s);
  });

  return (
    <group ref={group}>
      <mesh ref={core} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} flatShading />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.22} />
      </mesh>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.28} />
      </lineSegments>
      {nodes.map((p, i) => (
        <Float key={i} speed={1 + (i % 5) * 0.3} floatIntensity={0.4} rotationIntensity={0}>
          <mesh position={p} scale={0.05 + (i % 4) * 0.025}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={i % 6 === 0 ? '#ffffff' : GOLD} emissive={GOLD} emissiveIntensity={i % 6 === 0 ? 1.6 : 0.6} metalness={0.6} roughness={0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function HeroScene({ className }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 7.5], fov: 42 }} fallback={<FallbackOrb label="Interactive technology ecosystem (static preview)" />}>
      <Ecosystem />
      <TierSparkles count={70} scale={[11, 8, 8]} size={2.2} />
    </SceneCanvas>
  );
}
