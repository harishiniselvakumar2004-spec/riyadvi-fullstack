const path = require('path');
const crypto = require('crypto');
const { query } = require('../config/db');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { ok } = require('../utils/respond');
const { signToken } = require('../middleware/auth');

// Whitelisted collections → table names (never interpolate user input into SQL).
const TABLES = {
  contacts: 'contacts',
  consultations: 'consultations',
  'health-checkups': 'health_checkups',
  'lead-magnet': 'lead_magnet_leads',
  applications: 'applications',
};

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!safeEqual(email, env.admin.email.toLowerCase()) || !safeEqual(password, env.admin.password)) {
    throw new AppError('Invalid email or password.', 401);
  }
  ok(res, { token: signToken(email), email }, 'Signed in');
});

exports.stats = asyncHandler(async (_req, res) => {
  const count = async (t) => Number((await query(`SELECT COUNT(*) FROM ${t}`)).rows[0].count);
  const [contacts, consultations, healthCheckups, leadMagnet, applications] = await Promise.all(
    Object.values(TABLES).map(count));
  const fresh = await query(
    `SELECT COUNT(*) FROM contacts WHERE status='new'`);
  const trend = await query(
    `SELECT to_char(d::date,'DD Mon') AS day,
       (SELECT COUNT(*) FROM contacts c WHERE c.created_at::date = d::date)
     + (SELECT COUNT(*) FROM consultations c WHERE c.created_at::date = d::date)
     + (SELECT COUNT(*) FROM health_checkups c WHERE c.created_at::date = d::date)
     + (SELECT COUNT(*) FROM lead_magnet_leads c WHERE c.created_at::date = d::date) AS total
     FROM generate_series(NOW() - interval '6 days', NOW(), interval '1 day') d`);
  ok(res, {
    totals: { contacts, consultations, healthCheckups, leadMagnet, applications },
    totalEnquiries: contacts + consultations + healthCheckups + leadMagnet,
    newContacts: Number(fresh.rows[0].count),
    trend: trend.rows.map((r) => ({ day: r.day, total: Number(r.total) })),
  });
});

exports.list = asyncHandler(async (req, res) => {
  const table = TABLES[req.params.collection];
  if (!table) throw new AppError('Unknown collection.', 404);
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const { rows } = await query(`SELECT * FROM ${table} ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
  const total = Number((await query(`SELECT COUNT(*) FROM ${table}`)).rows[0].count);
  ok(res, { items: rows, total });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const table = TABLES[req.params.collection];
  if (!table) throw new AppError('Unknown collection.', 404);
  const { rowCount } = await query(`UPDATE ${table} SET status=$1 WHERE id=$2`, [req.body.status, Number(req.params.id)]);
  if (!rowCount) throw new AppError('Record not found.', 404);
  ok(res, { id: Number(req.params.id), status: req.body.status }, 'Status updated');
});

exports.downloadResume = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT resume_path, resume_name FROM applications WHERE id=$1', [Number(req.params.id)]);
  if (!rows[0]?.resume_path) throw new AppError('Resume not found.', 404);
  res.download(path.join(__dirname, '..', '..', 'uploads', path.basename(rows[0].resume_path)), rows[0].resume_name);
});
