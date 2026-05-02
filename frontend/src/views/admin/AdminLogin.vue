<template>
  <div
    class="min-h-screen bg-cream flex items-center justify-center p-6"
    style="background: linear-gradient(135deg, #fdf6e3 0%, #f0d4a8 100%);"
  >
    <!-- Bandeirinhas no topo -->
    <div class="fixed top-0 left-0 right-0 z-10">
      <BandeirinhasSvg />
    </div>

    <div class="w-full max-w-sm animate-fadeUp">
      <!-- Logo / título -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🌽</div>
        <h1 class="font-festive text-4xl text-wood-700 mb-1">Arraial do Luiz</h1>
        <p class="font-body text-wood-500 text-sm">Área do Administrador</p>
      </div>

      <!-- Card de login -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-wood-200 shadow-wood p-8">
        <h2 class="font-display text-xl text-bark mb-6 text-center">Entrar</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block font-body text-sm text-wood-600 mb-1.5">Senha</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full px-4 py-3 rounded-xl border border-wood-200 bg-cream
                     font-body text-bark placeholder-wood-300 outline-none
                     focus:border-wood-500 focus:ring-2 focus:ring-wood-200
                     transition-colors"
              :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-100': error }"
            />
            <p v-if="error" class="mt-2 text-sm text-red-500 font-body">
              Senha incorreta. Tente novamente.
            </p>
          </div>

          <button
            type="submit"
            class="btn-festive w-full py-3.5"
            :disabled="!password || loading"
          >
            <span v-if="loading">Entrando...</span>
            <span v-else>Entrar 🎪</span>
          </button>
        </form>
      </div>

      <p class="text-center mt-6 font-body text-xs text-wood-400">
        Acesso restrito ao organizador da festa
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BandeirinhasSvg from '@/components/BandeirinhasSvg.vue'
import { setAdminSession } from '@/composables/useAdminAuth.js'

const router   = useRouter()
const password = ref('')
const error    = ref(false)
const loading  = ref(false)

// Senha configurável via .env (VITE_ADMIN_PASSWORD), fallback para 'arraial2025'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'arraial2025'

async function handleLogin() {
  loading.value = true
  error.value   = false

  // Simula latência mínima para não parecer que não fez nada
  await new Promise(r => setTimeout(r, 400))

  if (password.value === ADMIN_PASSWORD) {
    setAdminSession()
    router.push('/admin')
  } else {
    error.value = true
    password.value = ''
  }
  loading.value = false
}
</script>
