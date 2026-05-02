<template>
  <div>
    <!-- Cabeçalho com progresso -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h2 class="font-display text-2xl text-bark">Chamada da Festa 🎉</h2>
          <p class="font-body text-sm text-wood-500 mt-0.5">
            Marque os convidados conforme chegam
          </p>
        </div>
        <div class="text-right">
          <div class="font-display text-3xl text-bark">
            {{ arrivedCount }}<span class="text-wood-400 text-xl">/{{ total }}</span>
          </div>
          <div class="font-body text-xs text-wood-500">chegaram</div>
        </div>
      </div>

      <!-- Barra de progresso -->
      <div class="h-3 bg-wood-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-amber-400 to-festive-red rounded-full transition-all duration-500"
          :style="{ width: progressPct + '%' }"
        />
      </div>
      <div class="flex justify-between font-body text-xs text-wood-400 mt-1">
        <span>0</span>
        <span>{{ Math.round(progressPct) }}%</span>
        <span>{{ total }}</span>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex gap-2 mb-5 flex-wrap">
      <button
        v-for="f in FILTERS"
        :key="f.id"
        :class="[
          'px-3 py-1.5 rounded-full font-body text-sm font-semibold transition-colors',
          filter === f.id
            ? 'bg-wood-500 text-white'
            : 'bg-white text-wood-500 border border-wood-200 hover:bg-wood-100',
        ]"
        @click="filter = f.id"
      >
        {{ f.label }}
        <span class="ml-1 opacity-70">({{ f.count }})</span>
      </button>

      <!-- Busca -->
      <div class="relative ml-auto">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar convidado…"
          class="pl-8 pr-3 py-1.5 rounded-full border border-wood-200 font-body text-sm
                 bg-white text-bark placeholder-wood-300 focus:outline-none focus:ring-2
                 focus:ring-wood-400 w-48"
        />
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-wood-300"
             viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89
            3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
        </svg>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        v-for="i in 6" :key="i"
        class="h-24 bg-wood-50 rounded-2xl animate-pulse"
      />
    </div>

    <!-- Lista vazia -->
    <div v-else-if="filtered.length === 0" class="text-center py-16 text-wood-400">
      <div class="text-5xl mb-3">🌵</div>
      <p class="font-body">Nenhum convidado encontrado.</p>
    </div>

    <!-- Cards dos convidados -->
    <TransitionGroup
      v-else
      name="card"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      <div
        v-for="guest in filtered"
        :key="guest.id"
        :class="[
          'relative bg-white rounded-2xl border shadow-sm p-4 transition-all duration-300',
          guest.confirmed
            ? 'border-green-200 bg-green-50/50 shadow-green-100'
            : 'border-wood-100 hover:border-wood-300',
        ]"
      >
        <!-- Badge de chegou -->
        <div
          v-if="guest.confirmed"
          class="absolute top-3 right-3 bg-green-500 text-white text-xs font-body font-bold
                 px-2 py-0.5 rounded-full flex items-center gap-1"
        >
          <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414
              0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          Chegou
        </div>

        <!-- Info -->
        <div class="pr-16">
          <p class="font-display text-base text-bark leading-tight truncate">{{ guest.name }}</p>
          <p class="font-body text-xs text-wood-400 mt-0.5">
            <span v-if="guest.plusOne > 0">
              +{{ guest.plusOne }} acompanhante{{ guest.plusOne > 1 ? 's' : '' }}
              · {{ 1 + guest.plusOne }} pessoas
            </span>
            <span v-else>Sozinho(a)</span>
          </p>
          <p v-if="guest.phone" class="font-body text-xs text-wood-400 truncate mt-0.5">
            📱 {{ guest.phone }}
          </p>
        </div>

        <!-- Botão de ação -->
        <div class="mt-3 flex gap-2">
          <button
            v-if="!guest.confirmed"
            class="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-body
                   font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
            :disabled="loadingId === guest.id"
            @click="markArrived(guest)"
          >
            <svg v-if="loadingId !== guest.id" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414
                0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loadingId === guest.id ? '...' : 'Chegou! ✓' }}
          </button>

          <button
            v-else
            class="flex-1 py-2 rounded-xl border border-green-300 text-green-700 font-body
                   font-semibold text-sm transition-colors hover:bg-red-50 hover:text-red-500
                   hover:border-red-300 flex items-center justify-center gap-1.5"
            :disabled="loadingId === guest.id"
            @click="unmarkArrived(guest)"
          >
            <svg v-if="loadingId !== guest.id" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1
                0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293
                1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10
                8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loadingId === guest.id ? '...' : 'Desfazer' }}
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { CONFIRM_GUEST, UPDATE_GUEST } from '@/graphql/queries'

const props = defineProps({
  guests:  { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['refresh'])

// ── Local state ──────────────────────────────────────────
const filter    = ref('all')
const search    = ref('')
const loadingId = ref(null)

// ── Stats ────────────────────────────────────────────────
const arrivedCount = computed(() => props.guests.filter((g) => g.confirmed).length)
const total        = computed(() => props.guests.length)
const progressPct  = computed(() =>
  total.value === 0 ? 0 : (arrivedCount.value / total.value) * 100
)

const FILTERS = computed(() => [
  { id: 'all',        label: 'Todos',          count: props.guests.length },
  { id: 'waiting',   label: 'Aguardando',     count: props.guests.filter((g) => !g.confirmed).length },
  { id: 'arrived',   label: 'Chegaram',       count: arrivedCount.value },
])

// ── Filtered list ────────────────────────────────────────
const filtered = computed(() => {
  let list = [...props.guests]

  if (filter.value === 'waiting') list = list.filter((g) => !g.confirmed)
  if (filter.value === 'arrived') list = list.filter((g) => g.confirmed)

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter((g) => g.name.toLowerCase().includes(q))
  }

  // Não confirmados primeiro
  list.sort((a, b) => {
    if (a.confirmed !== b.confirmed) return a.confirmed ? 1 : -1
    return a.name.localeCompare(b.name, 'pt-BR')
  })

  return list
})

// ── Mutations ────────────────────────────────────────────
const { mutate: confirmMut }   = useMutation(CONFIRM_GUEST)
const { mutate: updateGuestMut } = useMutation(UPDATE_GUEST)

async function markArrived(guest) {
  loadingId.value = guest.id
  try {
    await confirmMut({ id: guest.id })
    emit('refresh')
  } catch (e) {
    console.error('Erro ao confirmar chegada:', e)
  } finally {
    loadingId.value = null
  }
}

async function unmarkArrived(guest) {
  loadingId.value = guest.id
  try {
    await updateGuestMut({ id: guest.id, input: { confirmed: false } })
    emit('refresh')
  } catch (e) {
    console.error('Erro ao desfazer chegada:', e)
  } finally {
    loadingId.value = null
  }
}
</script>

<style scoped>
.card-enter-active,
.card-leave-active { transition: all 0.3s ease; }
.card-enter-from   { opacity: 0; transform: translateY(8px); }
.card-leave-to     { opacity: 0; transform: scale(0.95); }
</style>
