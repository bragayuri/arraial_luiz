<template>
  <div class="min-h-screen bg-cream">

    <!-- ── Sidebar/Header ───────────────────────────────── -->
    <header
      class="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-wood-200 shadow-sm"
    >
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <span class="text-xl">🌽</span>
          <span class="font-festive text-xl text-wood-700 leading-none">Arraiau do Luiz</span>
          <span class="hidden sm:inline text-wood-300 mx-1">·</span>
          <span class="hidden sm:inline font-body text-sm text-wood-500">Admin</span>
        </div>

        <!-- Tabs de navegação -->
        <nav class="flex items-center gap-1">
          <button
            v-for="tab in TABS"
            :key="tab.id"
            :class="[
              'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-body text-sm font-semibold transition-colors',
              activeTab === tab.id
                ? 'bg-wood-500 text-white'
                : 'text-wood-500 hover:bg-wood-100 hover:text-wood-700',
            ]"
            @click="activeTab = tab.id"
          >
            <span>{{ tab.icon }}</span>
            <span class="hidden sm:inline">{{ tab.label }}</span>
          </button>
        </nav>

        <div class="flex items-center gap-2">
          <!-- Botão de atualizar dados -->
          <button
            :class="['flex items-center gap-1.5 font-body text-sm transition-colors px-3 py-1.5 rounded-lg',
              refreshing ? 'text-wood-300 cursor-not-allowed' : 'text-wood-400 hover:bg-wood-100 hover:text-wood-700']"
            :disabled="refreshing"
            :title="refreshing ? 'Atualizando...' : 'Atualizar dados'"
            @click="handleRefresh"
          >
            <svg
              class="w-4 h-4"
              :class="{ 'animate-spin': refreshing }"
              viewBox="0 0 20 20" fill="currentColor"
            >
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
            </svg>
            <span class="hidden sm:inline">{{ refreshing ? 'Atualizando...' : 'Atualizar' }}</span>
          </button>

          <!-- Logout -->
          <button
            class="flex items-center gap-1.5 font-body text-sm text-wood-400 hover:text-wood-600 transition-colors"
            @click="handleLogout"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 4a1 1 0 10-2 0v.01a1 1 0 102 0V11z" clip-rule="evenodd"/>
              <path d="M13 9h2.586l-.293-.293a1 1 0 011.414-1.414l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L15.586 11H13V9z"/>
            </svg>
            <span class="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ── Conteúdo ───────────────────────────────────────── -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      <!-- Resumo no topo -->
      <section v-if="summary" class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <div class="col-span-2 sm:col-span-1 bg-white/80 rounded-2xl border border-wood-100 shadow-card p-4 text-center">
          <div class="font-display text-3xl text-bark">{{ summary.totalGuests }}</div>
          <div class="font-body text-xs text-wood-500 mt-1">Total convidados</div>
        </div>
        <div class="bg-white/80 rounded-2xl border border-wood-100 shadow-card p-4 text-center">
          <div class="font-display text-3xl text-green-600">{{ summary.confirmedGuests }}</div>
          <div class="font-body text-xs text-wood-500 mt-1">Confirmados</div>
        </div>
        <div class="bg-white/80 rounded-2xl border border-wood-100 shadow-card p-4 text-center">
          <div class="font-display text-3xl text-amber-500">{{ summary.totalGuests - summary.confirmedGuests }}</div>
          <div class="font-body text-xs text-wood-500 mt-1">Pendentes</div>
        </div>
        <div class="bg-white/80 rounded-2xl border border-wood-100 shadow-card p-4 text-center">
          <div class="font-display text-3xl text-wood-600">{{ summary.claimedItems }}</div>
          <div class="font-body text-xs text-wood-500 mt-1">Itens OK</div>
        </div>
        <div class="bg-white/80 rounded-2xl border border-wood-100 shadow-card p-4 text-center">
          <div class="font-display text-3xl text-wood-400">{{ summary.availableItems }}</div>
          <div class="font-body text-xs text-wood-500 mt-1">Disponíveis</div>
        </div>
      </section>

      <!-- Tab: Convidados -->
      <section v-show="activeTab === 'guests'">
        <GuestsTable
          :guests="guests"
          :loading="guestsLoading"
          @add-guest="openGuestModal(null)"
          @edit-guest="openGuestModal"
          @delete-guest="handleDeleteGuest"
        />
      </section>

      <!-- Tab: Insumos -->
      <section v-show="activeTab === 'items'">
        <ItemsManager
          :items="items"
          :loading="itemsLoading"
          :saving="itemSaving"
          @submit-item="handleSubmitItem"
          @delete-item="handleDeleteItem"
        />
      </section>

      <!-- Tab: Chamada -->
      <section v-show="activeTab === 'attendance'">
        <AttendancePanel
          :guests="guests"
          :loading="guestsLoading"
          @refresh="handleRefresh"
        />
      </section>
    </main>

    <!-- Modal de convidado -->
    <GuestModal
      :show="showGuestModal"
      :guest="editingGuest"
      :saving="guestSaving"
      @close="showGuestModal = false"
      @submit="handleSubmitGuest"
    />

    <!-- Confirm delete dialog -->
    <Transition name="modal">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="deleteTarget = null"
      >
        <div class="absolute inset-0 bg-bark/50 backdrop-blur-sm" @click="deleteTarget = null" />
        <div class="relative bg-cream rounded-2xl border border-wood-200 shadow-wood p-6 max-w-sm w-full text-center animate-fadeUp">
          <div class="text-4xl mb-3">⚠️</div>
          <h4 class="font-display text-lg text-bark mb-2">Confirmar exclusão</h4>
          <p class="font-body text-sm text-wood-500 mb-5">
            Remover <strong class="text-bark">{{ deleteTarget.name }}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-body font-semibold text-sm
                     hover:bg-red-600 transition-colors"
              :disabled="deleteLoading"
              @click="confirmDelete"
            >
              {{ deleteLoading ? 'Removendo...' : 'Sim, remover' }}
            </button>
            <button class="btn-outline flex-1 py-2.5 text-sm" @click="deleteTarget = null">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'

import GuestsTable      from '@/components/admin/GuestsTable.vue'
import ItemsManager    from '@/components/admin/ItemsManager.vue'
import GuestModal      from '@/components/admin/GuestModal.vue'
import AttendancePanel from '@/components/admin/AttendancePanel.vue'
import { clearAdminSession } from '@/composables/useAdminAuth.js'

import {
  GET_ALL_GUESTS,
  GET_ALL_ITEMS,
  GET_PARTY_SUMMARY,
  CREATE_GUEST,
  UPDATE_GUEST,
  DELETE_GUEST,
  CREATE_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
} from '@/graphql/queries'

const router = useRouter()

const TABS = [
  { id: 'guests',     icon: '👥', label: 'Convidados' },
  { id: 'items',      icon: '🛒', label: 'Insumos' },
  { id: 'attendance', icon: '✅', label: 'Chamada' },
]
const activeTab = ref('guests')

// ── Queries com polling a cada 30s para manter dados frescos ─
const POLL_MS = 30_000

const { result: guestsResult, loading: guestsLoading, refetch: refetchGuests } =
  useQuery(GET_ALL_GUESTS, null, { fetchPolicy: 'network-only', pollInterval: POLL_MS })

const { result: itemsResult, loading: itemsLoading, refetch: refetchItems } =
  useQuery(GET_ALL_ITEMS, null, { fetchPolicy: 'network-only', pollInterval: POLL_MS })

const { result: summaryResult, refetch: refetchSummary } =
  useQuery(GET_PARTY_SUMMARY, null, { fetchPolicy: 'network-only', pollInterval: POLL_MS })

const guests  = computed(() => guestsResult.value?.guests ?? [])
const items   = computed(() => itemsResult.value?.items ?? [])
const summary = computed(() => summaryResult.value?.partySummary ?? null)

// Botão "Atualizar" manual
const refreshing = ref(false)
async function handleRefresh() {
  refreshing.value = true
  try {
    await Promise.all([refetchGuests(), refetchItems(), refetchSummary()])
  } finally {
    refreshing.value = false
  }
}

// ── Mutations: Guests ─────────────────────────────────────
const { mutate: createGuestMut } = useMutation(CREATE_GUEST)
const { mutate: updateGuestMut } = useMutation(UPDATE_GUEST)
const { mutate: deleteGuestMut } = useMutation(DELETE_GUEST)

const showGuestModal = ref(false)
const editingGuest   = ref(null)
const guestSaving    = ref(false)

function openGuestModal(guest) {
  editingGuest.value = guest ?? null
  showGuestModal.value = true
}

async function handleSubmitGuest({ guest, data }) {
  guestSaving.value = true
  try {
    if (guest) {
      await updateGuestMut({ id: guest.id, input: data })
    } else {
      await createGuestMut({ input: data })
    }
    showGuestModal.value = false
    await Promise.all([refetchGuests(), refetchSummary()])
  } catch (e) {
    console.error('Erro ao salvar convidado:', e)
  } finally {
    guestSaving.value = false
  }
}

// ── Mutations: Items ──────────────────────────────────────
const { mutate: createItemMut } = useMutation(CREATE_ITEM)
const { mutate: updateItemMut } = useMutation(UPDATE_ITEM)
const { mutate: deleteItemMut } = useMutation(DELETE_ITEM)

const itemSaving = ref(false)

async function handleSubmitItem({ editing, data }) {
  itemSaving.value = true
  try {
    if (editing) {
      await updateItemMut({ id: editing.id, input: data })
    } else {
      await createItemMut({ input: data })
    }
    await Promise.all([refetchItems(), refetchSummary()])
  } catch (e) {
    console.error('Erro ao salvar item:', e)
  } finally {
    itemSaving.value = false
  }
}

// ── Delete genérico ───────────────────────────────────────
const deleteTarget  = ref(null)
const deleteLoading = ref(false)
const deleteType    = ref('')   // 'guest' | 'item'

function handleDeleteGuest(guest) {
  deleteTarget.value = guest
  deleteType.value   = 'guest'
}

function handleDeleteItem(item) {
  deleteTarget.value = item
  deleteType.value   = 'item'
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  try {
    if (deleteType.value === 'guest') {
      await deleteGuestMut({ id: deleteTarget.value.id })
      await Promise.all([refetchGuests(), refetchSummary()])
    } else {
      await deleteItemMut({ id: deleteTarget.value.id })
      await Promise.all([refetchItems(), refetchSummary()])
    }
    deleteTarget.value = null
  } catch (e) {
    console.error('Erro ao excluir:', e)
  } finally {
    deleteLoading.value = false
  }
}

// ── Logout ────────────────────────────────────────────────
function handleLogout() {
  clearAdminSession()
  router.push('/admin/login')
}

</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
