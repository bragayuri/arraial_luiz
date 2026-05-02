/**
 * pool.js
 * Singleton do Pool de conexões PostgreSQL.
 * Suporta DATABASE_URL (Render/Heroku) ou variáveis individuais.
 */

require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render fornece certificado SSL em produção
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 10,               // máximo de conexões simultâneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL:', err.message);
});

module.exports = pool;
