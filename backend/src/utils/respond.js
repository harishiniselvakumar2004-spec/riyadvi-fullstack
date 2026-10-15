// Consistent response envelope: { success, message?, data? }
exports.ok = (res, data, message, status = 200) =>
  res.status(status).json({ success: true, ...(message && { message }), ...(data !== undefined && { data }) });
exports.created = (res, data, message) => exports.ok(res, data, message, 201);
