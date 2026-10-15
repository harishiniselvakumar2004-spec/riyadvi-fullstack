const { z } = require('zod');

const text = (label, max = 200) => z.string({ required_error: `${label} is required` }).trim().min(1, `${label} is required`).max(max);
const optional = (max = 200) => z.string().trim().max(max).optional().or(z.literal('')).transform((v) => v || null);
const email = z.string({ required_error: 'Email is required' }).trim().toLowerCase().email('Enter a valid email address').max(200);
const phone = z.string().trim().regex(/^[+\d][\d\s().-]{6,19}$/, 'Enter a valid phone number');
const optionalPhone = z.union([phone, z.literal('')]).optional().transform((v) => v || null);

exports.contact = z.object({
  name: text('Name', 120), email, phone: optionalPhone, company: optional(160),
  requirement: optional(120), message: text('Message', 3000).min(10, 'Please add a little more detail'),
});

exports.consultation = z.object({
  name: text('Name', 120), email, phone: optionalPhone, company: optional(160),
  preferredDate: optional(60), topic: optional(200), notes: optional(2000),
});

exports.healthCheckup = z.object({
  name: text('Name', 120), email, phone: optionalPhone, company: text('Company', 160),
  answers: z.record(z.any()).default({}),
});

exports.leadMagnet = z.object({
  name: text('Name', 120), company: text('Company', 160), email, phone,
});

exports.application = z.object({
  jobSlug: optional(160), name: text('Name', 120), email, phone,
  position: text('Position', 160), message: optional(3000),
});

exports.adminLogin = z.object({ email, password: z.string().min(1, 'Password is required') });
exports.statusUpdate = z.object({ status: z.enum(['new', 'contacted', 'qualified', 'closed']) });
