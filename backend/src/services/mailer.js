const nodemailer = require('nodemailer');
const env = require('../config/env');

const transport = env.mail.host
  ? nodemailer.createTransport({
      host: env.mail.host, port: env.mail.port, secure: env.mail.port === 465,
      auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined,
    })
  : null;

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Fire-and-forget notification: never fails the request. */
async function notify(subject, fields) {
  const rows = Object.entries(fields).filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#777">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('');
  const html = `<h2 style="font-family:sans-serif">${esc(subject)}</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>`;
  if (!transport) return console.log(`[mail:dev] ${subject}`, fields);
  try {
    await transport.sendMail({ from: env.mail.from, to: env.mail.notify, subject: `[Riyadvi] ${subject}`, html });
  } catch (err) {
    console.error('[mail] failed:', err.message);
  }
}

module.exports = { notify };
