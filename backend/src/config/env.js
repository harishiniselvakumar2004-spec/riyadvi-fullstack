require('dotenv').config();

const bool = (v) => String(v).toLowerCase() === 'true';

module.exports = {
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 5000,
  clientOrigins: (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
    .split(',').map((s) => s.trim()).filter(Boolean),
  publicApiUrl: process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`,
  db: {
    url: process.env.DATABASE_URL || 'postgres://riyadvi:riyadvi@localhost:5432/riyadvi',
    ssl: bool(process.env.DATABASE_SSL),
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@riyadvi.com',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe@123',
    jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || 'Riyadvi Website <no-reply@riyadvi.com>',
    notify: process.env.NOTIFY_EMAIL || 'hello@riyadvi.com',
  },
  links: {
    whatsapp: process.env.WHATSAPP_NUMBER || '919999999999',
    calendly: process.env.CALENDLY_URL || 'https://calendly.com',
  },
};
