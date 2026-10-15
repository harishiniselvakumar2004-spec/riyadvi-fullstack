import { useEffect } from 'react';

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Riyadvi Software Technologies` : 'Riyadvi Software Technologies — Technology & Digital Solutions Partner';
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
