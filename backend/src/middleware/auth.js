const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');

exports.signToken = (email) => jwt.sign({ email, role: 'admin' }, env.admin.jwtSecret, { expiresIn: '8h' });

exports.requireAdmin = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Authentication required.', 401));
  try {
    req.admin = jwt.verify(token, env.admin.jwtSecret);
    next();
  } catch {
    next(new AppError('Session expired. Please sign in again.', 401));
  }
};
