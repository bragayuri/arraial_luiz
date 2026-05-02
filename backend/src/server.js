/**
 * server.js
 * Ponto de entrada do Apollo Server 4 — Arraiau do Luiz Backend
 *
 * Deploy: Render (Web Service)
 * Env:    DATABASE_URL, PORT, NODE_ENV
 */

require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { readFileSync } = require('fs');
const path = require('path');

const { guestQueries, guestMutations, guestFields } = require('./resolvers/guestResolvers');
const { itemQueries, itemMutations, itemFields }   = require('./resolvers/itemResolvers');
const pool = require('./db/pool');

// ──────────────────────────────────────────
// Carrega o schema GraphQL do arquivo .graphql
// ──────────────────────────────────────────
const typeDefs = readFileSync(
  path.join(__dirname, '..', 'schema.graphql'),
  'utf-8'
);

// ──────────────────────────────────────────
// Resolvers unificados
// ──────────────────────────────────────────
const resolvers = {
  Query: {
    ...guestQueries,
    ...itemQueries,
  },
  Mutation: {
    ...guestMutations,
    ...itemMutations,
  },
  // Field resolvers
  ...guestFields,
  ...itemFields,
};

// ──────────────────────────────────────────
// Apollo Server
// ──────────────────────────────────────────
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Habilita introspection em produção (útil para o front consumir o schema)
  introspection: true,
  // API pública sem sessão por cookie; o default do Apollo 4 bloqueia CSRF quando não há
  // Content-Type “simples” ou cabeçalhos Apollo — isso quebra GET/Sandbox e alguns clients.
  csrfPrevention: false,
  formatError: (formattedError, error) => {
    const msg = formattedError.message ?? '';
    // DevTools / clients ocasionais mandam POST sem query — não poluir o log
    if (!msg.includes('non-empty `query`')) {
      console.error('[GraphQL Error]', error);
    }
    return {
      message: formattedError.message,
      code: formattedError.extensions?.code,
    };
  },
});

// ──────────────────────────────────────────
// Inicialização
// ──────────────────────────────────────────
async function start() {
  // Testa a conexão com o banco antes de subir
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('🌽 Conexão com o PostgreSQL estabelecida.');
  } catch (err) {
    console.error('❌ Falha ao conectar ao PostgreSQL:', err.message);
    process.exit(1);
  }

  const PORT = parseInt(process.env.PORT ?? '4000', 10);

  // CORS: libera o frontend em produção + localhost em dev
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ];

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT, host: '0.0.0.0' },
    context: async ({ req }) => ({
      headers: req.headers,
    }),
    // Apollo Standalone aceita corsOptions diretamente
    cors: {
      origin: (origin, callback) => {
        // Permite sem origem (curl, mobile) e origens permitidas
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS bloqueado: ${origin}`));
        }
      },
      credentials: true,
    },
  });

  console.log(`🎉 Arraiau do Luiz — GraphQL server rodando em: ${url}`);
}

start().catch((err) => {
  console.error('Erro fatal ao iniciar servidor:', err);
  process.exit(1);
});
