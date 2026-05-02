<template>
  <div class="space-y-5">
    <!-- Header com busca + botão adicionar -->
    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div class="relative flex-1 max-w-xs">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-wood-400 text-sm">🔍</span>
        <input
          v-model="search"
          type="search"
          placeholder="Buscar convidado..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-wood-200 bg-white/80
                 font-body text-sm text-bark placeholder-wood-300 outline-none
                 focus:border-wood-400 focus:ring-2 focus:ring-wood-100 transition-colors"
        />
      </div>
      <button class="btn-festive py-2.5 px-5 text-sm" @click="$emit('add-guest')">
        + Adicionar Convidado
      </button>
    </div>

    <!-- Stats rápidas -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white/70 rounded-xl p-4 border border-wood-100 text-center">
        <div class="font-display text-2xl text-bark">{{ guests.length }}</div>
        <div class="font-body text-xs text-wood-500 mt-0.5">Total</div>
      </div>
      <div class="bg-white/70 rounded-xl p-4 border border-wood-100 text-center">
        <div class="font-display text-2xl text-festive-green">{{ confirmedCount }}</div>
        <div class="font-body text-xs text-wood-500 mt-0.5">Confirmados</div>
      </div>
      <div class="bg-white/70 rounded-xl p-4 border border-wood-100 text-center">
        <div class="font-display text-2xl text-wood-400">{{ pendingCount }}</div>
        <div class="font-body text-xs text-wood-500 mt-0.5">Pendentes</div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white/80 rounded-2xl border border-wood-200 overflow-hidden shadow-card">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16 gap-3">
        <span class="text-3xl animate-spin" style="animation-duration:1.4s">🌽</span>
        <span class="font-body text-wood-400 text-sm">Carregando convidados...</span>
      </div>

      <!-- Lista vazia -->
      <div v-else-if="filtered.length === 0" class="text-center py-16">
        <div class="text-4xl mb-3">🎪</div>
        <p class="font-body text-wood-400 text-sm">
          {{ search ? 'Nenhum convidado encontrado.' : 'Ainda sem convidados cadastrados.' }}
        </p>
      </div>

      <!-- Tabela com dados -->
      <table v-else class="w-full text-sm font-body">
        <thead>
          <tr class="border-b border-wood-100 bg-wood-50/50">
            <th class="text-left py-3 px-4 text-wood-500 font-semibold text-xs uppercase tracking-wider">
              Convidado
            </th>
            <th class="text-left py-3 px-4 text-wood-500 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
              Contato
            </th>
            <th class="text-center py-3 px-4 text-wood-500 font-semibold text-xs uppercase tracking-wider">
              Status
            </th>
            <th class="text-left py-3 px-4 text-wood-500 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
              Vai trazer
            </th>
            <th class="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-wood-50">
          <tr
            v-for="guest in filtered"
            :key="guest.id"
            class="hover:bg-wood-50/40 transition-colors group"
          >
            <!-- Nome + acompanhante -->
            <td class="py-3 px-4">
              <div class="font-semibold text-bark">{{ guest.name }}</div>
              <div v-if="guest.plusOne > 0" class="text-xs text-wood-400 mt-0.5">+{{ guest.plusOne }} acompanhante{{ guest.plusOne > 1 ? 's' : '' }}</div>
            </td>

            <!-- Contato -->
            <td class="py-3 px-4 hidden sm:table-cell">
              <div v-if="guest.phone" class="text-wood-600">{{ guest.phone }}</div>
              <div v-if="guest.email" class="text-wood-400 text-xs mt-0.5">{{ guest.email }}</div>
              <div v-if="!guest.phone && !guest.email" class="text-wood-300 text-xs">—</div>
            </td>

            <!-- Status de confirmação -->
            <td class="py-3 px-4 text-center">
              <span
                :class="guest.confirmed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {{ guest.confirmed ? '✅ Confirmado' : '⏳ Pendente' }}
              </span>
            </td>

            <!-- Itens reivindicados -->
            <td class="py-3 px-4 hidden md:table-cell">
              <div v-if="guest.items?.length" class="flex flex-wrap gap-1">
                <span
                  v-for="item in guest.items"
                  :key="item.id"
                  class="category-badge text-xs"
                >
                  {{ item.name }}
                </span>
              </div>
              <span v-else class="text-wood-300 text-xs">Nenhum item</span>
            </td>

            <!-- Ações -->
            <td class="py-3 px-4">
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <!-- Copiar link -->
                <button
                  :title="`Copiar link do convite de ${guest.name}`"
                  class="p-1.5 rounded-lg hover:bg-wood-100 text-wood-500 hover:text-wood-700 transition-colors"
                  @click="copyLink(guest)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 000 2h1a1 1 0 110 2H8a3 3 0 100 6h1a1 1 0 000-2H8a1 1 0 110-2h1a3 3 0 000-6H8z"/>
                    <path d="M12 3a1 1 0 000 2h1a1 1 0 010 2h-1a3 3 0 000 6h1a1 1 0 000-2h-1a1 1 0 010-2h1a3 3 0 000-6h-1z"/>
                  </svg>
                </button>
                <!-- Editar -->
                <button
                  class="p-1.5 rounded-lg hover:bg-wood-100 text-wood-500 hover:text-wood-700 transition-colors"
                  @click="$emit('edit-guest', guest)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                </button>
                <!-- Excluir -->
                <button
                  class="p-1.5 rounded-lg hover:bg-red-100 text-wood-400 hover:text-red-600 transition-colors"
                  @click="$emit('delete-guest', guest)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Toast de link copiado -->
    <Transition name="toast">
      <div
        v-if="toastMsg"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
               bg-bark text-white text-sm font-body font-semibold
               px-5 py-3 rounded-full shadow-wood flex items-center gap-2"
      >
        <span>🔗</span> {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  guests:  { type: Array,   default: () => [] },
  loading: { type: Boolean, default: false },
})

defineEmits(['add-guest', 'edit-guest', 'delete-guest'])

const search   = ref('')
const toastMsg = ref('')

const filtered = computed(() => {
  if (!search.value) return props.guests
  const q = search.value.toLowerCase()
  return props.guests.filter(g =>
    g.name.toLowerCase().includes(q) ||
    g.email?.toLowerCase().includes(q) ||
    g.phone?.includes(q)
  )
})

const confirmedCount = computed(() => props.guests.filter(g => g.confirmed).length)
const pendingCount   = computed(() => props.guests.filter(g => !g.confirmed).length)

function copyLink(guest) {
  const base = window.location.origin
  const url  = `${base}/convite/${guest.id}`
  navigator.clipboard.writeText(url).then(() => {
    toastMsg.value = `Link de ${guest.name.split(' ')[0]} copiado!`
    setTimeout(() => { toastMsg.value = '' }, 2800)
  })
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
