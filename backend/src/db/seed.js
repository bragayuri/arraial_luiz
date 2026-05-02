/**
 * seed.js — dados mínimos para dev (convidado demo com UUID fixo).
 * Rode após migrate: npm run seed
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  const client = await pool.connect();
  try {
    console.log('🌽 Inserindo dados de seed...');
    await client.query(sql);
    console.log('✅ Seed concluído!');
  } catch (err) {
    console.error('❌ Erro no seed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
