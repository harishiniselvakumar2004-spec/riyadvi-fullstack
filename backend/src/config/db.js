const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.db.url,
  ssl: env.db.ssl ? { rejectUnauthorized: false } : false,
  max: 10,
});

pool.on('error', (err) => console.error('[db] idle client error', err.message));

module.exports = { pool, query: (text, params) => pool.query(text, params) };
