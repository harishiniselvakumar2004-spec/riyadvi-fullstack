import { Suspense, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Environment, Lightformer, Sparkles } from '@react-three/drei';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { useInView } from '../../hooks/useInView';

const TierContext = createContext('high');
export const useTier = () => useContext(TierContext);

/** Procedural studio lighting — no HDR download needed (faster, works offline). */
export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={1.4} color="#fff3d0" />
      <pointLight position={[-4, -2, -3]} intensity={18} color="#D4AF37" distance={14} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} color="#fff4d6" position={[0, 5, -4]} scale={[10, 3, 1]} />
        <Lightformer form="ring" intensity={2.2} color="#D4AF37" position={[-5, 1, 2]} scale={4} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[5, -1, 3]} scale={[2, 6, 1]} />
      </Environment>
    </>
  );
}

/**
 * Shared WebGL wrapper that implements the mobile / performance strategy:
 *  - tier 'none'  → renders the static `fallback` (reduced motion, no WebGL, data-saver)
 *  - tier 'low'   → dpr 1, no antialiasing, scenes reduce their object counts via useTier()
 *  - off-screen   → render loop paused (frameloop="never") so idle canvases cost nothing
 */
export default function SceneCanvas({ children, className = '', camera = { position: [0, 0, 6], fov: 45 }, fallback = null, lights = true }) {
  const tier = useDeviceTier();
  const [ref, inView] = useInView('150px');

  if (tier === 'none') return <div className={className}>{fallback}</div>;

  return (
    <div ref={ref} className={className}>
      <Canvas frameloop={inView ? 'always' : 'never'} dpr={tier === 'high' ? [1, 1.75] : 1} camera={camera}
        gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' }}>
        <AdaptiveDpr pixelated />
        <TierContext.Provider value={tier}>
          <Suspense fallback={null}>
            {lights && <StudioLights />}
            {children}
          </Suspense>
        </TierContext.Provider>
      </Canvas>
    </div>
  );
}

/** Particle field that halves itself on weaker devices. */
export function TierSparkles({ count = 60, scale = [10, 7, 7], size = 2, color = '#D4AF37', opacity = 0.7 }) {
  const tier = useTier();
  return <Sparkles count={tier === 'high' ? count : Math.round(count / 3)} scale={scale} size={size} speed={0.3} color={color} opacity={opacity} />;
}
