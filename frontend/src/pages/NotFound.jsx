import Button from '../components/ui/Button';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <section className="grid min-h-[80vh] place-items-center px-5 text-center">
      <div>
        <p className="font-display text-[9rem] font-bold leading-none text-gold-gradient">404</p>
        <h1 className="h-display mt-2 text-3xl">This page drifted out of orbit.</h1>
        <p className="mt-3 text-zinc-400">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8"><Button to="/">Back to home</Button></div>
      </div>
    </section>
  );
}
