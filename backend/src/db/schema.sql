-- Riyadvi website schema (PostgreSQL). Safe to re-run.

-- ── Lead & form tables ──────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, company TEXT,
  requirement TEXT, message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, company TEXT,
  preferred_date TEXT, topic TEXT, notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_checkups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, company TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_magnet_leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, company TEXT, email TEXT NOT NULL, phone TEXT,
  resource TEXT NOT NULL DEFAULT 'software-project-planning-guide',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  job_slug TEXT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
  position TEXT NOT NULL, resume_path TEXT, resume_name TEXT, message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Dynamic content (CMS-ready: swap for Strapi / Sanity later) ──
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY, slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0, published BOOLEAN NOT NULL DEFAULT TRUE,
  data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY, slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0, published BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY, slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, tags TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE, published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY, slug TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL, designation TEXT NOT NULL, experience TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs (department);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts (created_at DESC);
