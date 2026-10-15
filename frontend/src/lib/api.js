const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const TOKEN_KEY = 'riyadvi_admin_token';

export class ApiError extends Error {
  constructor(message, status, fields) { super(message); this.status = status; this.fields = fields || {}; }
}

export const auth = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = 'GET', body, form, admin } = {}) {
  const headers = {};
  if (admin && auth.get()) headers.Authorization = `Bearer ${auth.get()}`;
  let payload;
  if (form) payload = form;
  else if (body) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError('Cannot reach the server. Please check your connection and try again.', 0);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new ApiError(json.message || 'Something went wrong.', res.status, json.errors);
  return json;
}

export const api = {
  get: (path, opts) => request(path, opts).then((j) => j.data),
  post: (path, body) => request(path, { method: 'POST', body }),
  postForm: (path, form) => request(path, { method: 'POST', form }),
  adminGet: (path) => request(path, { admin: true }).then((j) => j.data),
  adminPatch: (path, body) => request(path, { method: 'PATCH', body, admin: true }),
  adminLogin: (body) => request('/admin/login', { method: 'POST', body }),
  resumeUrl: (id) => `${BASE}/api/admin/applications/${id}/resume`,
  fetchBlob: async (path) => {
    const res = await fetch(`${BASE}/api${path}`, { headers: { Authorization: `Bearer ${auth.get()}` } });
    if (!res.ok) throw new ApiError('Download failed', res.status);
    return res.blob();
  },
};
