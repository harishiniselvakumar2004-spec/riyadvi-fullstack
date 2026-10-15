import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import SceneCanvas, { TierSparkles } from './SceneCanvas';
import FallbackOrb from './FallbackOrb';

const GOLD = '#D4AF37';
const gold = <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} />;
const dark = <meshStandardMaterial color="#0c0c0e" metalness={0.8} roughness={0.35} />;
const glass = <meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0.1} metalness={0.2} />;

/** Each variant is a tiny, purposeful scene representing one service. */
function Web() {
  return (
    <group rotation={[0.1, -0.5, 0]}>
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={1.4 + i * 0.3} floatIntensity={0.6} rotationIntensity={0.2}>
          <group position={[i * 0.55 - 0.55, i * -0.1, -i * 0.9]}>
            <RoundedBox args={[3.4, 2.2, 0.08]} radius={0.06}>{dark}</RoundedBox>
            <mesh position={[0, 0.95, 0.06]}><planeGeometry args={[3.3, 0.22]} /><meshBasicMaterial color="#1c1c20" /></mesh>
            {[-1.45, -1.3, -1.15].map((x, k) => <mesh key={k} position={[x, 0.95, 0.07]}><circleGeometry args={[0.04, 16]} /><meshBasicMaterial color={k === 0 ? GOLD : '#555'} /></mesh>)}
            <mesh position={[-0.7, 0.2, 0.06]}><planeGeometry args={[1.5, 0.9]} /><meshBasicMaterial color={GOLD} transparent opacity={0.85 - i * 0.2} /></mesh>
            {[0.35, -0.05, -0.45].map((y, k) => <mesh key={k} position={[0.9, y, 0.06]}><planeGeometry args={[1.1, 0.16]} /><meshBasicMaterial color="#3a3a40" /></mesh>)}
          </group>
        </Float>
      ))}
    </group>
  );
}

function App() {
  const ref = useRef();
  useFrame((s, dt) => { ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, s.pointer.x * 0.8 + Math.sin(s.clock.elapsedTime * 0.6) * 0.3, 4, dt); });
  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <group ref={ref} rotation={[0.1, 0, 0.08]}>
        <RoundedBox args={[1.7, 3.4, 0.22]} radius={0.2} smoothness={4}>{gold}</RoundedBox>
        <RoundedBox args={[1.52, 3.2, 0.05]} radius={0.15} position={[0, 0, 0.1]}>{dark}</RoundedBox>
        {[0.95, 0.2, -0.55].map((y, i) => <mesh key={i} position={[0, y, 0.14]}><planeGeometry args={[1.25, 0.55]} /><meshBasicMaterial color={GOLD} transparent opacity={0.9 - i * 0.28} /></mesh>)}
        <mesh position={[0, -1.25, 0.14]}><circleGeometry args={[0.16, 24]} /><meshBasicMaterial color="#fff" /></mesh>
      </group>
    </Float>
  );
}

function Marketing() {
  const bars = useRef([]);
  const vals = [0.8, 1.2, 1.0, 1.7, 2.2, 2.9, 3.5];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    bars.current.forEach((m, i) => { if (!m) return; const h = vals[i] * (0.8 + 0.2 * Math.sin(t * 1.5 + i)); m.scale.y = h; m.position.y = h / 2 - 1.4; });
  });
  return (
    <group rotation={[0.15, -0.5, 0]}>
      {vals.map((_, i) => (
        <mesh key={i} ref={(el) => (bars.current[i] = el)} position={[i * 0.62 - 1.9, 0, 0]}>
          <boxGeometry args={[0.4, 1, 0.4]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.08 + i * 0.03} />
        </mesh>
      ))}
      <mesh position={[0, -1.42, 0]}><boxGeometry args={[4.6, 0.04, 0.8]} />{dark}</mesh>
    </group>
  );
}

function ArVr() {
  const ring = useRef(); const orb = useRef();
  useFrame((_, dt) => { ring.current.rotation.z += dt * 0.5; ring.current.rotation.x += dt * 0.2; orb.current.rotation.y += dt * 0.6; });
  return (
    <group>
      <group ref={orb}>
        <RoundedBox args={[2.8, 1.3, 1.2]} radius={0.35} smoothness={4}>{dark}</RoundedBox>
        <mesh position={[0, 0, 0.62]}><planeGeometry args={[2.35, 0.85]} /><meshBasicMaterial color={GOLD} transparent opacity={0.65} /></mesh>
      </group>
      <mesh ref={ring}><torusGeometry args={[2.3, 0.025, 16, 100]} />{gold}</mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}><torusGeometry args={[2.9, 0.015, 16, 100]} /><meshBasicMaterial color={GOLD} transparent opacity={0.5} /></mesh>
      {[0, 1, 2, 3].map((i) => <Float key={i} speed={2} floatIntensity={1}><mesh position={[Math.cos(i * 1.6) * 2.4, Math.sin(i * 1.6) * 1.2, Math.sin(i) * 0.8]}><octahedronGeometry args={[0.18]} />{gold}</mesh></Float>)}
    </group>
  );
}

function Model() {
  const ref = useRef();
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.25; });
  return (
    <group ref={ref}>
      <mesh><torusKnotGeometry args={[1.05, 0.34, 220, 32]} /><meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} /></mesh>
      <mesh scale={1.12}><torusKnotGeometry args={[1.05, 0.34, 60, 8]} /><meshBasicMaterial color={GOLD} wireframe transparent opacity={0.18} /></mesh>
    </group>
  );
}

function UiUx() {
  const panels = [
    { p: [-1.5, 0.9, 0], s: [2, 1.2], c: GOLD }, { p: [1.3, 0.4, 0.6], s: [1.6, 1.8], c: '#1d1d22' },
    { p: [-0.4, -1, 0.9], s: [2.2, 0.8], c: '#2a2a31' }, { p: [1.6, -1.3, -0.4], s: [1, 1], c: GOLD },
  ];
  return (
    <group rotation={[0.1, -0.35, 0]}>
      {panels.map((x, i) => (
        <Float key={i} speed={1.2 + i * 0.4} floatIntensity={1} rotationIntensity={0.5}>
          <RoundedBox args={[...x.s, 0.08]} radius={0.08} position={x.p}>
            <meshStandardMaterial color={x.c} metalness={x.c === GOLD ? 1 : 0.5} roughness={0.3} />
          </RoundedBox>
        </Float>
      ))}
      <mesh position={[0, 0, -0.6]}><planeGeometry args={[5.5, 4]} />{glass}</mesh>
    </group>
  );
}

const SCENES = { web: Web, app: App, marketing: Marketing, arvr: ArVr, model: Model, uiux: UiUx };

export default function ServiceScene({ variant = 'web', className }) {
  const Scene = SCENES[variant] || Web;
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 7], fov: 42 }} fallback={<FallbackOrb label={`${variant} service visual`} />}>
      <Scene />
      <TierSparkles count={40} scale={[8, 6, 6]} />
      {variant === 'model' && <OrbitControls enableZoom={false} enablePan={false} />}
    </SceneCanvas>
  );
}
