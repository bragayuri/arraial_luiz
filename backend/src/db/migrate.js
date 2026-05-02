/**
 * migrate.js
 * Executa o schema.sql contra o banco configurado em DATABASE_URL.
 * Uso: node src/db/migrate.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const client = await pool.connect();
  try {
    console.log('🌽 Iniciando migração do banco de dados...');
    await client.query(sql);
    console.log('✅ Migração concluída com sucesso!');
  } catch (err) {
    console.error('❌ Erro na migração:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
