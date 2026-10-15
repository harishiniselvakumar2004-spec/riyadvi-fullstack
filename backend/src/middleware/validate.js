const AppError = require('../utils/AppError');

// validate(zodSchema) → parses req.body, replaces it with the cleaned value.
module.exports = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const fields = {};
    for (const issue of result.error.issues) fields[issue.path.join('.') || 'form'] ??= issue.message;
    return next(new AppError('Please correct the highlighted fields.', 422, fields));
  }
  req.body = result.data;
  next();
};
