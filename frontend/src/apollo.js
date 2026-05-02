/**
 * apollo.js
 * Configuração do Apollo Client para o Arraiau do Luiz.
 * Conecta ao backend GraphQL (Sprint 1).
 */

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'

// ── URL do backend ────────────────────────────────────────
// Em dev: proxy Vite aponta /graphql → localhost:4000
// Em prod: variável de ambiente injetada no build
const GRAPHQL_URI =
  import.meta.env.VITE_GRAPHQL_URI ?? 'http://localhost:4000'

// ── HTTP Link ─────────────────────────────────────────────
// Content-Type: JSON para POST; apollo-require-preflight satisfaz preventCsrf do Apollo 4
// se CSRF estiver ligado no servidor (útil em cross-origin dev).
const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
  headers: {
    'content-type': 'application/json',
    'apollo-require-preflight': 'true',
  },
})

// ── Error Link ────────────────────────────────────────────
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error] ${message}`, { locations, path })
    })
  }
  if (networkError) {
    console.error('[Network error]', networkError.message)
  }
})

// ── Cache ─────────────────────────────────────────────────
const cache = new InMemoryCache({
  typePolicies: {
    Guest: {
      keyFields: ['id'],
    },
    Item: {
      keyFields: ['id'],
    },
  },
})

// ── Client ────────────────────────────────────────────────
export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
  devtools: { enabled: import.meta.env.DEV },
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
    query:      { fetchPolicy: 'network-only' },
  },
})
