const env = require('../config/env');

exports.notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong.';
  if (err.name === 'MulterError') { status = 400; message = `Upload error: ${err.message}`; }
  if (status >= 500) {
    console.error('[error]', err);
    if (env.isProd) message = 'Internal server error.';
  }
  res.status(status).json({ success: false, message, ...(err.details && { errors: err.details }) });
};
