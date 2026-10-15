const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

(async () => {
  try {
    await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
    console.log('✔ Database schema ready');
  } catch (err) {
    console.error('✖ Schema init failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
