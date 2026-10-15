import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, OrbitControls, ContactShadows } from '@react-three/drei';
import { useRef } from 'react';
import SceneCanvas from './SceneCanvas';
import FallbackOrb from './FallbackOrb';

const HOTSPOTS = [
  { id: 'filter', pos: [0.9, 0.9, 0.5], title: '5-stage filtration', text: 'Sediment, carbon and RO membranes working in sequence.' },
  { id: 'sensor', pos: [0.7, -0.1, 0.8], title: 'Smart TDS sensor', text: 'Live water-quality readout on the front panel.' },
  { id: 'tap', pos: [-0.5, -1.2, 0.9], title: 'Instant dispenser', text: 'Hot, ambient and chilled water on demand.' },
];

function Product({ onHotspot, active }) {
  const ring = useRef();
  useFrame((_, dt) => { ring.current.rotation.y += dt * 0.4; });
  return (
    <group position={[0, 0.2, 0]}>
      <mesh><cylinderGeometry args={[0.95, 1.05, 2.6, 48]} /><meshStandardMaterial color="#0d0d10" metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[0, 1.4, 0]}><cylinderGeometry args={[1, 0.95, 0.22, 48]} /><meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} /></mesh>
      <mesh position={[0, 0.2, 0.96]}><planeGeometry args={[0.9, 0.5]} /><meshBasicMaterial color="#D4AF37" transparent opacity={0.85} /></mesh>
      <mesh position={[0, -0.9, 0.5]}><boxGeometry args={[0.5, 0.12, 0.9]} /><meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.25} /></mesh>
      <mesh ref={ring} position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.35, 0.03, 12, 80]} /><meshBasicMaterial color="#D4AF37" /></mesh>
      {HOTSPOTS.map((h) => (
        <Html key={h.id} position={h.pos} center zIndexRange={[10, 0]}>
          <button onClick={() => onHotspot(h)} aria-label={h.title}
            className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold backdrop-blur transition ${active?.id === h.id ? 'border-white bg-gold text-black' : 'animate-pulse border-gold bg-black/60 text-gold'}`}>+</button>
        </Html>
      ))}
    </group>
  );
}

/** Interactive 3D case-study presentation: orbit the product and tap hotspots. */
export default function CaseStudyScene({ className = '' }) {
  const [active, setActive] = useState(null);
  return (
    <div className={`relative ${className}`}>
      <SceneCanvas className="h-full w-full" camera={{ position: [0, 0.6, 6], fov: 40 }} fallback={<FallbackOrb label="Product showcase" />}>
        <Product onHotspot={setActive} active={active} />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={8} blur={2.5} far={3} color="#D4AF37" />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
      </SceneCanvas>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 sm:inset-x-auto sm:right-4 sm:w-72">
        <div className="glass-gold pointer-events-auto rounded-2xl p-4 text-sm">
          {active ? (<><p className="font-semibold text-gold">{active.title}</p><p className="mt-1 text-zinc-300">{active.text}</p></>)
            : <p className="text-zinc-300">Drag to rotate · tap <span className="text-gold">+</span> hotspots to explore.</p>}
        </div>
      </div>
    </div>
  );
}
