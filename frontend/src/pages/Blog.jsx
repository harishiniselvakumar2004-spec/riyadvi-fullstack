import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHero from '../components/ui/PageHero';
import { ApiState, Skeleton } from '../components/ui/Cards';

const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const PostCard = ({ post, featured = false }) => {
  const [a, b] = post.gradient || ['#D4AF37', '#000'];
  return (
    <motion.div whileHover={{ y: -6 }} className={featured ? 'md:col-span-2 lg:col-span-3' : ''}>
      <Link to={`/blog/${post.slug}`} className={`group grid overflow-hidden rounded-3xl border border-white/10 bg-ink-800 ${featured ? 'md:grid-cols-2' : ''}`}>
        <div className={`relative ${featured ? 'min-h-[260px]' : 'aspect-[16/9]'}`} style={{ background: `radial-gradient(120% 100% at 20% 0%, ${a}66, ${b} 75%)` }}>
          <div className="absolute inset-0 grid-bg opacity-40" />
          {featured && <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">Featured</span>}
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[.2em] text-gold">{post.category} · {post.readTime} min read</p>
          <h3 className={`mt-3 font-display font-semibold text-white ${featured ? 'text-3xl' : 'text-xl'}`}>{post.title}</h3>
          <p className="mt-3 text-sm text-zinc-400">{post.excerpt}</p>
          <p className="mt-5 text-xs text-zinc-500">{fmt(post.publishedAt)} · {post.author}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default function Blog() {
  usePageMeta('Blog', 'Insights on web, apps, 3D, marketing and digital strategy from Riyadvi.');
  const [q, setQ] = useState(''); const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState(''); const [tag, setTag] = useState('');
  useEffect(() => { const t = setTimeout(() => setDebounced(q), 300); return () => clearTimeout(t); }, [q]);

  const params = new URLSearchParams({ ...(debounced && { q: debounced }), ...(category && { category }), ...(tag && { tag }) }).toString();
  const { data, loading, error } = useApi(`/posts${params ? `?${params}` : ''}`);
  const featured = !debounced && !category && !tag ? data?.posts.find((p) => p.featured) : null;
  const rest = data?.posts.filter((p) => p !== featured) || [];

  return (
    <>
      <PageHero eyebrow="Blog" title="Ideas, guides and engineering notes." />
      <section className="container-x pb-24">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {['', ...(data?.categories || [])].map((c) => (
              <button key={c || 'all'} onClick={() => setCategory(c)} className={`rounded-full border px-4 py-2 text-sm transition ${category === c ? 'border-gold bg-gold text-black' : 'border-white/15 text-zinc-300 hover:border-gold/50'}`}>{c || 'All'}</button>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search articles…" aria-label="Search articles" className="field md:max-w-xs" />
        </div>
        {data?.tags?.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2 text-xs">
            {data.tags.map((t) => <button key={t} onClick={() => setTag(tag === t ? '' : t)} className={`rounded-md px-2.5 py-1 ${tag === t ? 'bg-gold text-black' : 'bg-white/5 text-zinc-400 hover:text-gold'}`}>#{t}</button>)}
          </div>
        )}
        <ApiState loading={loading} error={error} skeleton={<div className="grid gap-6 md:grid-cols-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72" />)}</div>}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured && <PostCard post={featured} featured />}
            {rest.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
          {data?.posts.length === 0 && <p className="text-zinc-400">No articles match your filters.</p>}
        </ApiState>
      </section>
    </>
  );
}
