const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { ok } = require('../utils/respond');

const merge = (r) => ({ slug: r.slug, ...r.data });

exports.listServices = asyncHandler(async (_req, res) => {
  const { rows } = await query('SELECT slug, data FROM services WHERE published ORDER BY sort_order');
  ok(res, rows.map(merge));
});

exports.getService = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT slug, data FROM services WHERE slug=$1 AND published', [req.params.slug]);
  if (!rows[0]) throw new AppError('Service not found.', 404);
  ok(res, merge(rows[0]));
});

exports.listProjects = asyncHandler(async (req, res) => {
  const { service } = req.query;
  const { rows } = await query(
    `SELECT slug, featured, data FROM projects WHERE published
       AND ($1::text IS NULL OR data->'services' ? $1) ORDER BY sort_order`, [service || null]);
  ok(res, rows.map((r) => ({ ...merge(r), featured: r.featured })));
});

exports.getProject = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT slug, data FROM projects WHERE slug=$1 AND published', [req.params.slug]);
  if (!rows[0]) throw new AppError('Case study not found.', 404);
  const project = merge(rows[0]);
  const next = await query(
    'SELECT slug, data FROM projects WHERE published AND slug<>$1 ORDER BY sort_order LIMIT 2', [project.slug]);
  ok(res, { ...project, related: next.rows.map(merge) });
});

exports.listPosts = asyncHandler(async (req, res) => {
  const { q, category, tag } = req.query;
  const { rows } = await query(
    `SELECT slug, category, tags, featured, published_at, data FROM posts
      WHERE published
        AND ($1::text IS NULL OR category = $1)
        AND ($2::text IS NULL OR $2 = ANY(tags))
        AND ($3::text IS NULL OR data->>'title' ILIKE '%'||$3||'%' OR data->>'excerpt' ILIKE '%'||$3||'%')
      ORDER BY published_at DESC`,
    [category || null, tag || null, q || null]);
  const posts = rows.map((r) => {
    const { content, ...card } = r.data; // list view omits the article body
    return { slug: r.slug, category: r.category, tags: r.tags, featured: r.featured, publishedAt: r.published_at, ...card };
  });
  const meta = await query(
    `SELECT category, unnest(tags) AS tag FROM posts WHERE published`);
  ok(res, {
    posts,
    categories: [...new Set(meta.rows.map((m) => m.category))],
    tags: [...new Set(meta.rows.map((m) => m.tag))],
  });
});

exports.getPost = asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT slug, category, tags, published_at, data FROM posts WHERE slug=$1 AND published', [req.params.slug]);
  const r = rows[0];
  if (!r) throw new AppError('Article not found.', 404);
  const rel = await query(
    `SELECT slug, category, tags, published_at, data FROM posts
      WHERE published AND slug<>$1 AND (category=$2 OR tags && $3::text[])
      ORDER BY published_at DESC LIMIT 3`, [r.slug, r.category, r.tags]);
  const card = (x) => { const { content, ...c } = x.data; return { slug: x.slug, category: x.category, tags: x.tags, publishedAt: x.published_at, ...c }; };
  ok(res, { ...card(r), content: r.data.content, related: rel.rows.map(card) });
});

exports.listJobs = asyncHandler(async (req, res) => {
  const { department, designation, experience } = req.query;
  const { rows } = await query(
    `SELECT slug, department, designation, experience, posted_at, data FROM jobs
      WHERE published
        AND ($1::text IS NULL OR department=$1)
        AND ($2::text IS NULL OR designation=$2)
        AND ($3::text IS NULL OR experience=$3)
      ORDER BY posted_at DESC`, [department || null, designation || null, experience || null]);
  const facets = await query('SELECT department, designation, experience FROM jobs WHERE published');
  const uniq = (k) => [...new Set(facets.rows.map((f) => f[k]))];
  ok(res, {
    jobs: rows.map((r) => ({ slug: r.slug, department: r.department, designation: r.designation,
      experience: r.experience, postedAt: r.posted_at, ...r.data })),
    filters: { departments: uniq('department'), designations: uniq('designation'), experiences: uniq('experience') },
  });
});

exports.getJob = asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT slug, department, designation, experience, posted_at, data FROM jobs WHERE slug=$1 AND published', [req.params.slug]);
  const r = rows[0];
  if (!r) throw new AppError('Job not found.', 404);
  ok(res, { slug: r.slug, department: r.department, designation: r.designation,
    experience: r.experience, postedAt: r.posted_at, ...r.data });
});
