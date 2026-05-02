/**
 * Aplica migrate_plus_one.sql (BOOLEAN → SMALLINT em guests.plus_one).
 * Uso: npm run migrate:plus-one
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, 'migrate_plus_one.sql'), 'utf8');
  const client = await pool.connect();
  try {
    console.log('🌽 Aplicando migrate_plus_one (plus_one → SMALLINT 0–5)...');
    await client.query(sql);
    console.log('✅ Migração concluída.');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
