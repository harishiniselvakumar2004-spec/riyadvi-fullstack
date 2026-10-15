import { Link, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { usePageMeta } from '../hooks/usePageMeta';
import { ApiState } from '../components/ui/Cards';
import { PostCard } from './Blog';
import CtaBanner from '../components/sections/CtaBanner';
import NotFound from './NotFound';

/** Renders structured blocks ({type, text}) — the same shape a headless CMS rich-text field can be mapped to. */
const Block = ({ b }) => (b.type === 'h2'
  ? <h2 className="mb-4 mt-12 font-display text-3xl font-semibold text-white">{b.text}</h2>
  : <p className="mb-5 text-lg leading-[1.85] text-zinc-300">{b.text}</p>);

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useApi(`/posts/${slug}`);
  usePageMeta(post?.title, post?.excerpt);
  if (error?.status === 404) return <NotFound />;
  return (
    <ApiState loading={loading} error={error} skeleton={<div className="min-h-screen" />}>
      {post && (
        <>
          <article className="container-x max-w-3xl pb-20 pt-40">
            <Link to="/blog" className="text-sm text-zinc-400 hover:text-gold">← All articles</Link>
            <p className="eyebrow mt-8">{post.category} · {post.readTime} min read</p>
            <h1 className="h-display mt-4 text-4xl md:text-6xl">{post.title}</h1>
            <p className="mt-6 text-sm text-zinc-500">{new Date(post.publishedAt).toLocaleDateString('en-IN', { dateStyle: 'long' })} · {post.author}</p>
            <div className="mt-6 flex flex-wrap gap-2">{post.tags.map((t) => <Link key={t} to="/blog" className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-zinc-400">#{t}</Link>)}</div>
            <div className="mt-12 border-t border-white/10 pt-10">{post.content.map((b, i) => <Block key={i} b={b} />)}</div>
          </article>
          {post.related?.length > 0 && (
            <section className="container-x pb-12">
              <h2 className="mb-8 font-display text-3xl text-white">Related articles</h2>
              <div className="grid gap-6 md:grid-cols-3">{post.related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
            </section>
          )}
          <CtaBanner />
        </>
      )}
    </ApiState>
  );
}
