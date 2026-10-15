import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const cache = new Map();

/** Tiny data hook with in-memory caching. Swap for TanStack Query when the app grows. */
export function useApi(path) {
  const [state, setState] = useState(() => ({ data: cache.get(path) ?? null, loading: !cache.has(path), error: null }));

  useEffect(() => {
    if (!path) return;
    let alive = true;
    if (cache.has(path)) setState({ data: cache.get(path), loading: false, error: null });
    else setState({ data: null, loading: true, error: null });
    api.get(path)
      .then((data) => { cache.set(path, data); alive && setState({ data, loading: false, error: null }); })
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => { alive = false; };
  }, [path]);

  return state;
}
