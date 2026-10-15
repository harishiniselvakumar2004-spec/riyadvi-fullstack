const { query } = require('../config/db');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { created } = require('../utils/respond');
const { notify } = require('../services/mailer');

exports.contact = asyncHandler(async (req, res) => {
  const b = req.body;
  const { rows } = await query(
    `INSERT INTO contacts (name,email,phone,company,requirement,message)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [b.name, b.email, b.phone, b.company, b.requirement, b.message]);
  notify('New contact enquiry', b);
  created(res, { id: rows[0].id }, 'Thanks! We will get back to you within one business day.');
});

exports.consultation = asyncHandler(async (req, res) => {
  const b = req.body;
  const { rows } = await query(
    `INSERT INTO consultations (name,email,phone,company,preferred_date,topic,notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [b.name, b.email, b.phone, b.company, b.preferredDate, b.topic, b.notes]);
  notify('New consultation request', b);
  created(res, { id: rows[0].id, calendly: env.links.calendly }, 'Consultation requested. Our team will confirm shortly.');
});

// Lightweight readiness score (0-100) derived from the checkup answers.
function scoreCheckup(a = {}) {
  let s = 40;
  if (a.hasWebsite === 'yes-modern') s += 15; else if (a.hasWebsite === 'yes-outdated') s += 5;
  const channels = Array.isArray(a.channels) ? a.channels.length : 0;
  s += Math.min(channels * 5, 15);
  if (a.analytics === 'yes') s += 10;
  if (a.automation === 'high') s += 15; else if (a.automation === 'some') s += 8;
  if (a.mobileApp === 'yes') s += 5;
  return Math.max(10, Math.min(100, s));
}

exports.healthCheckup = asyncHandler(async (req, res) => {
  const b = req.body;
  const score = scoreCheckup(b.answers);
  const { rows } = await query(
    `INSERT INTO health_checkups (name,email,phone,company,answers,score)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [b.name, b.email, b.phone, b.company, JSON.stringify(b.answers), score]);
  notify('New Business Health Checkup', { name: b.name, email: b.email, phone: b.phone, company: b.company, score, ...b.answers });
  created(res, { id: rows[0].id, score }, 'Checkup received. Your growth report is on its way.');
});

exports.leadMagnet = asyncHandler(async (req, res) => {
  const b = req.body;
  const { rows } = await query(
    `INSERT INTO lead_magnet_leads (name,company,email,phone) VALUES ($1,$2,$3,$4) RETURNING id`,
    [b.name, b.company, b.email, b.phone]);
  notify('New lead magnet download', b);
  created(res, { id: rows[0].id, downloadUrl: `${env.publicApiUrl}/api/lead-magnet/download` }, 'Your guide is ready to download.');
});

exports.application = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Please attach your resume.', 422, { resume: 'Resume is required' });
  const b = req.body;
  const { rows } = await query(
    `INSERT INTO applications (job_slug,name,email,phone,position,resume_path,resume_name,message)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [b.jobSlug, b.name, b.email, b.phone, b.position, req.file.filename, req.file.originalname, b.message]);
  notify('New job application', { ...b, resume: req.file.originalname });
  created(res, { id: rows[0].id }, 'Application submitted. Good luck!');
});
