const rateLimit = require('express-rate-limit');

const make = (windowMs, max) => rateLimit({
  windowMs, max, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' },
});

exports.apiLimiter = make(15 * 60 * 1000, 300);
exports.formLimiter = make(15 * 60 * 1000, 20);
exports.loginLimiter = make(15 * 60 * 1000, 10);
