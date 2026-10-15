# Riyadvi Software Technologies — Website Revamp

A multi-page, dynamic corporate website with a 3D interactive experience, a Node/Express API, PostgreSQL storage and an admin dashboard.

> **Before you submit:** the *AI Tools Used* section below describes how this codebase was produced. Edit it so it reflects **your own** real workflow, prompts and manual changes — the interview walkthrough will ask about them. Client/case-study copy, milestones and the guide PDF are **sample content** to replace with approved material.

## Features
- 17 routes: Home, Services (+6 dynamic pages), Portfolio (+10 case studies), About, Blog (+articles), Careers (+jobs), Contact, Business Health Checkup, Planning Guide, Admin.
- **3D**: interactive hero ecosystem, per-service 3D scenes, 3D technology constellation, interactive 3D product case study (Puratap) with hotspots.
- **Scroll storytelling**: GSAP ScrollTrigger-pinned "Challenge → Growth" section, Lenis smooth scrolling, scroll-linked timelines.
- **Lead capture** (all stored in PostgreSQL, validated with Zod, email-notified): contact, consultation, multi-step health checkup (with readiness score), lead magnet (PDF download), job applications (resume upload).
- **Admin dashboard** (`/admin`): totals, 7-day trend, tables with status workflow, resume download.
- Blog search / category / tag filters, careers department / designation / experience filters.
- WhatsApp + Calendly links (configured via env), OpenStreetMap embed.

## Tech stack
| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router 6, Tailwind CSS 3 |
| 3D | Three.js, React Three Fiber, Drei |
| Animation | GSAP + ScrollTrigger, Lenis, Framer Motion (Motion) |
| Backend | Node.js, Express 4, Zod, Helmet, CORS, rate-limit, Multer, Nodemailer, JWT |
| Database | PostgreSQL (`pg`) |
| Deploy | Vercel (frontend) · Render/Railway + Neon/Render Postgres (backend) |

## Project structure
```
frontend/src
  components/{layout,ui,sections,three}   reusable building blocks
  pages/                                  route components (admin/ for dashboard)
  hooks/ lib/ styles/                     data, device-tier, forms, API client
backend/src
  config/ middleware/ controllers/ routes/ services/ utils/
  db/{schema.sql,init.js,seed.js,data/}   schema + seed content
```

## Installation
Requires Node 18+ and PostgreSQL 14+ (or Docker).
```bash
# 1. Database (option A: Docker)
docker compose up -d
# 2. Backend
cd backend && cp .env.example .env && npm install
npm run db:setup        # creates tables + seeds services/projects/posts/jobs
npm run dev             # http://localhost:5000
# 3. Frontend
cd ../frontend && cp .env.example .env && npm install
npm run dev             # http://localhost:5173
```
Admin: `http://localhost:5173/admin` → credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Environment variables
**backend/.env** — `PORT`, `CLIENT_ORIGINS` (comma-separated frontend URLs, no trailing slash), `PUBLIC_API_URL`, `DATABASE_URL`, `DATABASE_SSL` (true on hosted DBs), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM`, `NOTIFY_EMAIL`, `WHATSAPP_NUMBER`, `CALENDLY_URL`.
**frontend/.env** — `VITE_API_URL` (deployed backend URL).
Without SMTP settings, notifications are logged to the console.

## Database setup
`npm run db:init` applies `src/db/schema.sql` (idempotent). `npm run db:seed` upserts content from `src/db/data/*.js`.
Tables: `contacts`, `consultations`, `health_checkups`, `lead_magnet_leads`, `applications` + content tables `services`, `projects`, `posts`, `jobs` (JSONB `data` column).

## API endpoints
All responses: `{ success, message?, data?, errors? }`.
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health`, `/api/config` | status; WhatsApp/Calendly links |
| GET | `/api/services`, `/api/services/:slug` | services |
| GET | `/api/projects[?service=]`, `/api/projects/:slug` | portfolio |
| GET | `/api/posts[?q=&category=&tag=]`, `/api/posts/:slug` | blog (+related) |
| GET | `/api/jobs[?department=&designation=&experience=]`, `/api/jobs/:slug` | careers |
| POST | `/api/contact` `/api/consultation` `/api/health-checkup` `/api/lead-magnet` | leads (JSON) |
| POST | `/api/applications` | job application (multipart, `resume` file ≤5 MB) |
| GET | `/api/lead-magnet/download` | guide PDF |
| POST | `/api/admin/login` | JWT |
| GET | `/api/admin/stats`, `/api/admin/:collection` | dashboard (Bearer token) |
| PATCH | `/api/admin/:collection/:id/status` | `new / contacted / qualified / closed` |

## Dynamic content — how to add things without rebuilding
Content lives in the database and is rendered by **one template per type**:
- **New service** → add an object to `db/data/services.js` (or insert a row) → `/services/<slug>` and its card appear automatically. `visual` picks one of six 3D/SVG scenes.
- **New project** → `db/data/projects.js`; set `presentation: '3d'` for the interactive viewer.
- **New post / job** → `posts.js` / `jobs.js`. Post bodies are structured blocks (`{type, text}`), the same shape a CMS rich-text field maps to.
The frontend only talks to `/api/*`, so swapping to Strapi/Sanity/WordPress means changing the controller queries (or proxying) — no page rewrites.
(Production next step: an admin CRUD UI for these tables.)

## Deployment
1. **Database**: create a Postgres instance (Neon / Render / Railway), copy the connection string.
2. **Backend** (Render/Railway): root `backend`, build `npm install`, start `npm start`; set env vars (`DATABASE_SSL=true`, `CLIENT_ORIGINS=<vercel url>`, `PUBLIC_API_URL=<backend url>`, strong `JWT_SECRET`/`ADMIN_PASSWORD`). Run `npm run db:setup` once (shell/one-off job).
3. **Frontend** (Vercel): root `frontend`, framework Vite, env `VITE_API_URL=<backend url>`. `vercel.json` handles SPA routing.
4. Record URLs here: Frontend `…` · Backend `…`
Note: uploaded resumes use local disk, which is ephemeral on free hosts — move to S3/Cloudinary for production.

## AI Tools Used
*(Replace/extend with your real usage — format required by the brief.)*

**Claude**
- **Purpose:** scaffold the full-stack architecture (Express API, Postgres schema, React Router app), R3F scenes, form flows and admin dashboard.
- **Example prompt:** "Build a premium gold/black corporate site for a software company with an interactive 3D hero, dynamic service/portfolio/blog/job templates backed by Express + PostgreSQL, multi-step lead forms and an admin dashboard."
- **Generated:** project structure, API, seed data, 3D scenes, pages.
- **Manual work to document:** *(your edits — e.g. tuning 3D performance, brand copy, fixing bugs found in testing, deployment)*.
- **Why selected:** strong at multi-file architecture and explaining trade-offs.

Add entries for any other tool you use (Midjourney/Blender for assets, Copilot, etc.).

## 3D libraries used
Three.js, @react-three/fiber, @react-three/drei (Float, RoundedBox, OrbitControls, Html, Sparkles, Environment/Lightformer, ContactShadows, AdaptiveDpr).
## Animation libraries used
GSAP + ScrollTrigger (pinned story), Lenis (smooth scroll, synced to GSAP ticker), Framer Motion (reveals, magnetic buttons, tilt cards, page transitions, SVG service visuals).
## Third-party assets
None bundled. Fonts: Inter & Poppins (Google Fonts). Map: OpenStreetMap embed. No HDRIs/textures — lighting is procedural.

## Performance optimisation
- Route-level code splitting; Three/R3F/motion in separate cached chunks; 3D scenes lazy-loaded.
- `SceneCanvas` tiers (`useDeviceTier`): **high** (dpr ≤1.75), **low** for mobile/weak devices (dpr 1, no AA, ~half the nodes/particles), **none** (reduced-motion, no WebGL, data-saver) → static CSS fallback.
- Canvases pause rendering when off-screen; `AdaptiveDpr`; procedural lighting (no HDR download).
- Home service cards use animated SVG instead of six WebGL contexts.
- Scroll pinning disabled on small screens; `prefers-reduced-motion` respected.
- Run Lighthouse on the deployed build and record scores here.

## Known limitations
- Sample/placeholder case-study, milestone and award content; guide PDF is a simple sample.
- Single-page app (client-side rendered): no SSR/prerender for SEO; consider Next.js migration.
- Admin is a single env-configured user; no CRUD for content yet.
- Resume storage is local disk; no automated tests; Calendly is a link, not an embed.
## Future improvements
SSR/Next.js, admin content CRUD or headless CMS, S3 uploads, Blender/glTF assets with Draco, email templates + autoresponders, analytics, automated tests/CI, i18n.

## Suggested git history
`git init` then commit in logical steps, e.g. `chore: scaffold backend`, `feat: add contact/lead APIs`, `feat: seed dynamic content`, `feat: interactive 3D hero`, `feat: dynamic service pages`, `feat: portfolio case studies`, `feat: business health checkup`, `feat: admin dashboard`, `perf: device-tier 3D strategy`, `docs: README`.
