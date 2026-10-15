const { pool } = require('../config/db');
const services = require('./data/services');
const projects = require('./data/projects');
const posts = require('./data/posts');
const jobs = require('./data/jobs');

const daysAgo = (n) => new Date(Date.now() - n * 86400000);

(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const [i, { slug, ...data }] of services.entries()) {
      await client.query(
        `INSERT INTO services (slug, sort_order, data) VALUES ($1,$2,$3)
         ON CONFLICT (slug) DO UPDATE SET sort_order=EXCLUDED.sort_order, data=EXCLUDED.data`, [slug, i, data]);
    }
    for (const [i, p] of projects.entries()) {
      await client.query(
        `INSERT INTO projects (slug, sort_order, featured, data) VALUES ($1,$2,$3,$4)
         ON CONFLICT (slug) DO UPDATE SET sort_order=EXCLUDED.sort_order, featured=EXCLUDED.featured, data=EXCLUDED.data`,
        [p.slug, i, p.featured, p.data]);
    }
    for (const p of posts) {
      await client.query(
        `INSERT INTO posts (slug, category, tags, featured, published_at, data) VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (slug) DO UPDATE SET category=EXCLUDED.category, tags=EXCLUDED.tags, featured=EXCLUDED.featured, data=EXCLUDED.data`,
        [p.slug, p.category, p.tags, p.featured, daysAgo(p.daysAgo), p.data]);
    }
    for (const j of jobs) {
      await client.query(
        `INSERT INTO jobs (slug, department, designation, experience, posted_at, data) VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (slug) DO UPDATE SET department=EXCLUDED.department, designation=EXCLUDED.designation,
           experience=EXCLUDED.experience, data=EXCLUDED.data`,
        [j.slug, j.department, j.designation, j.experience, daysAgo(j.daysAgo), j.data]);
    }
    await client.query('COMMIT');
    console.log(`✔ Seeded ${services.length} services, ${projects.length} projects, ${posts.length} posts, ${jobs.length} jobs`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('✖ Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();
