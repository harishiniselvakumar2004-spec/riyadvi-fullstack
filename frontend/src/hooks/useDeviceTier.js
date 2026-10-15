import { useMemo } from 'react';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

/**
 * Decides how much 3D a device can take.
 *  'high' → full scene · 'low' → fewer objects, dpr 1, no post effects · 'none' → static fallback
 */
export function getDeviceTier() {
  if (typeof window === 'undefined') return 'none';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !hasWebGL()) return 'none';
  const mobile = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
  const weak = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 2;
  const saveData = navigator.connection?.saveData;
  if (saveData) return 'none';
  return mobile || weak ? 'low' : 'high';
}

export const useDeviceTier = () => useMemo(getDeviceTier, []);
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
