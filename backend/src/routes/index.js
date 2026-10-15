const path = require('path');
const router = require('express').Router();
const env = require('../config/env');
const { query } = require('../config/db');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { formLimiter, loginLimiter } = require('../middleware/rateLimit');
const { requireAdmin } = require('../middleware/auth');
const schemas = require('../controllers/schemas');
const forms = require('../controllers/forms.controller');
const content = require('../controllers/content.controller');
const admin = require('../controllers/admin.controller');
const { ok } = require('../utils/respond');

// ── Meta ───────────────────────────────────────────
router.get('/health', async (_req, res) => {
  await query('SELECT 1');
  ok(res, { status: 'ok', uptime: process.uptime() });
});
router.get('/config', (_req, res) => ok(res, { whatsapp: env.links.whatsapp, calendly: env.links.calendly }));

// ── Public content (API-ready for a headless CMS) ──
router.get('/services', content.listServices);
router.get('/services/:slug', content.getService);
router.get('/projects', content.listProjects);
router.get('/projects/:slug', content.getProject);
router.get('/posts', content.listPosts);
router.get('/posts/:slug', content.getPost);
router.get('/jobs', content.listJobs);
router.get('/jobs/:slug', content.getJob);

// ── Lead capture ───────────────────────────────────
router.post('/contact', formLimiter, validate(schemas.contact), forms.contact);
router.post('/consultation', formLimiter, validate(schemas.consultation), forms.consultation);
router.post('/health-checkup', formLimiter, validate(schemas.healthCheckup), forms.healthCheckup);
router.post('/lead-magnet', formLimiter, validate(schemas.leadMagnet), forms.leadMagnet);
router.post('/applications', formLimiter, upload.single('resume'), validate(schemas.application), forms.application);
router.get('/lead-magnet/download', (_req, res) =>
  res.download(path.join(__dirname, '..', '..', 'assets', 'software-project-planning-guide.pdf')));

// ── Admin ──────────────────────────────────────────
router.post('/admin/login', loginLimiter, validate(schemas.adminLogin), admin.login);
router.get('/admin/stats', requireAdmin, admin.stats);
router.get('/admin/applications/:id/resume', requireAdmin, admin.downloadResume);
router.get('/admin/:collection', requireAdmin, admin.list);
router.patch('/admin/:collection/:id/status', requireAdmin, validate(schemas.statusUpdate), admin.updateStatus);

module.exports = router;
