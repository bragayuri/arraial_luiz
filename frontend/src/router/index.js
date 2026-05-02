import { createRouter, createWebHistory } from 'vue-router'
import { isAdminAuthenticated } from '@/composables/useAdminAuth.js'

/** Mesmo UUID que backend/src/db/seed.sql — GraphQL exige UUID válido, não slug "demo". */
const DEMO_GUEST_ID =
  import.meta.env.VITE_DEMO_GUEST_ID ?? '00000000-0000-0000-0000-000000000001'

const routes = [
  {
    path: '/',
    redirect: `/convite/${DEMO_GUEST_ID}`,
  },
  {
    path: '/convite/demo',
    redirect: `/convite/${DEMO_GUEST_ID}`,
  },
  {
    path: '/convite/:guestId',
    name: 'GuestView',
    component: () => import('@/views/GuestView.vue'),
    meta: { title: 'Arraiau do Luiz — Seu Convite' },
  },

  // ── Admin ─────────────────────────────────────────────
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/AdminLogin.vue'),
    meta: { title: 'Admin — Entrar' },
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: () => import('@/views/admin/AdminView.vue'),
    meta: { title: 'Admin — Arraiau do Luiz', requiresAdmin: true },
  },

  // ── 404 fallback ──────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

// Navigation guard: protege /admin
router.beforeEach((to) => {
  document.title = to.meta.title ?? 'Arraiau do Luiz 🌽'

  if (to.meta.requiresAdmin && !isAdminAuthenticated()) {
    return { name: 'AdminLogin' }
  }
})

export default router
