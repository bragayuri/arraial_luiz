/**
 * useAdminAuth.js
 * Autenticação simples para o MVP do admin.
 * Usa sessionStorage (limpa ao fechar o browser) + uma flag em memória.
 */

const SESSION_KEY = 'arraial_admin_auth'

export function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

export function setAdminSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true')
  } catch {
    // sessionStorage não disponível (SSR ou incognito bloqueado)
  }
}

export function clearAdminSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch { /* noop */ }
}
