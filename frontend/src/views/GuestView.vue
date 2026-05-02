<template>
  <div class="min-h-screen bg-cream">

    <!-- ── Loading ──────────────────────────────────────── -->
    <LoadingSpinner v-if="guestLoading" />

    <!-- ── Erro: convidado não encontrado ───────────────── -->
    <div
      v-else-if="guestError || !guest"
      class="flex flex-col items-center justify-center min-h-screen p-8 text-center"
    >
      <div class="text-7xl mb-6">😢</div>
      <h1 class="font-display text-3xl text-wood-700 mb-3">Convite não encontrado</h1>
      <p class="font-body text-wood-500">
        Verifique o link com quem te convidou.
      </p>
    </div>

    <!-- ── Conteúdo principal ────────────────────────────── -->
    <template v-else>

      <!-- Hero com foto e bandeirinhas -->
      <BandeirinhasHero
        party-date="Sábado, 6 de Junho de 2025"
        party-time="A partir das 16h"
        party-location="Ver no Google Maps"
        party-location-url="https://www.google.com/maps/search/?api=1&query=D16F9C5"
      />

      <!-- Seção de boas-vindas ao convidado -->
      <section class="max-w-2xl mx-auto px-6 py-10 text-center animate-fadeUp">
        <p class="font-body text-wood-500 text-sm tracking-widest uppercase mb-2">
          Olá,
        </p>
        <h2 class="font-display text-4xl md:text-5xl text-bark mb-4">
          {{ guest.name }} <span class="text-wood-500">🤠</span>
        </h2>
        <p class="font-body text-wood-600 text-lg leading-relaxed max-w-prose mx-auto">
          Você foi convidado para a primeira edição do Arraiau do Luiz!
          Vai ter música, quadrilha, comida típica e muita alegria!!
         <br> <strong class="text-bark">Conta pra nóis si você vem so?</strong>
        </p>
      </section>

      <!-- ── Botão de confirmação de presença ─────────────── -->
      <section class="max-w-2xl mx-auto px-6 pb-10">
        <div
          class="bg-white/70 backdrop-blur-sm rounded-3xl border border-wood-200
                 shadow-card p-8 text-center"
        >
          <!-- Já confirmado -->
          <template v-if="guest.confirmed">
            <div class="text-5xl mb-4">🎊</div>
            <h3 class="font-display text-2xl text-wood-700 mb-2">
              Presença Confirmada!
            </h3>
            <p class="font-body text-wood-500 text-sm">
              Você já confirmou presença. Mal podemos esperar! 🌽
            </p>
          </template>

          <!-- Ainda não confirmou -->
          <template v-else>
            <div class="text-5xl mb-4">🎪</div>
            <h3 class="font-display text-2xl text-bark mb-2">
              Vai comparecer?
            </h3>
            <p class="font-body text-wood-500 mb-6 text-sm">
              Confirme sua presença para que possamos planejar a festa!
            </p>

            <!-- Acompanhantes: stepper 0–5 -->
            <div class="mb-6">
              <p class="font-body text-wood-600 text-sm mb-3">
                Quantos acompanhantes você vai trazer?
              </p>
              <div class="flex items-center justify-center gap-4">
                <button
                  type="button"
                  class="w-10 h-10 rounded-full border-2 border-wood-300 flex items-center justify-center
                         font-body font-bold text-wood-600 text-lg transition-colors
                         hover:border-wood-500 hover:bg-wood-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="plusOneCount === 0"
                  @click="plusOneCount = Math.max(0, plusOneCount - 1)"
                >−</button>

                <div class="text-center min-w-[4rem]">
                  <span class="font-display text-3xl text-bark">{{ plusOneCount }}</span>
                  <p class="font-body text-xs text-wood-400 mt-0.5">
                    {{ plusOneCount === 0 ? 'sozinho(a)' : plusOneCount === 1 ? 'acompanhante' : 'acompanhantes' }}
                  </p>
                </div>

                <button
                  type="button"
                  class="w-10 h-10 rounded-full border-2 border-wood-300 flex items-center justify-center
                         font-body font-bold text-wood-600 text-lg transition-colors
                         hover:border-wood-500 hover:bg-wood-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="plusOneCount === 5"
                  @click="plusOneCount = Math.min(5, plusOneCount + 1)"
                >+</button>
              </div>
            </div>

            <button
              class="btn-festive w-full text-lg py-4"
              :disabled="confirmLoading"
              @click="handleConfirm"
            >
              <span v-if="confirmLoading">Confirmando... 🤞</span>
              <span v-else>✅ Confirmar Presença!</span>
            </button>

            <p v-if="confirmError" class="mt-3 text-sm text-red-500 font-body">
              Ops! Algo deu errado. Tente de novo. 😅
            </p>
          </template>
        </div>
      </section>

      <!-- ── Divisor festivo ───────────────────────────────── -->
      <div class="festive-divider max-w-2xl mx-auto px-6">
        <span class="font-festive text-wood-400 text-2xl px-2 whitespace-nowrap">
          Lista de Insumos
        </span>
      </div>

      <!-- ── Seção de Itens ────────────────────────────────── -->
      <section class="max-w-2xl mx-auto px-6 pb-8">
        <p class="font-body text-wood-500 text-center text-sm mb-6 leading-relaxed">
          Quer colaborar com a festa? Escolha um item para trazer.
          <br />Cada item pode ser reivindicado por apenas um convidado.
        </p>

        <!-- Loading dos itens -->
        <LoadingSpinner v-if="itemsLoading" message="Carregando itens..." />

        <!-- Filtro por categoria -->
        <div v-else class="space-y-6">
          <div
            v-if="Object.keys(itemsByCategory).length === 0"
            class="text-center py-12 text-wood-400 font-body"
          >
            Nenhum item disponível por enquanto. 🌵
          </div>

          <!-- Grupo por categoria -->
          <div
            v-for="(categoryItems, category) in itemsByCategory"
            :key="category"
            class="animate-fadeUp"
          >
            <h4 class="font-display text-wood-700 text-lg mb-3 flex items-center gap-2">
              <span class="w-1 h-5 bg-wood-400 rounded-full inline-block"></span>
              {{ category || 'Outros' }}
            </h4>
            <div class="grid gap-3 sm:grid-cols-2">
              <ItemCard
                v-for="item in categoryItems"
                :key="item.id"
                :item="item"
                :is-selected="selectedItemIds.has(item.id)"
                :current-guest-id="guest.id"
                @toggle="handleToggleItem"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- ── Botão fixo de salvar seleção ──────────────────── -->
      <Transition name="slide-up">
        <div
          v-if="pendingSelections.size > 0"
          class="fixed bottom-0 left-0 right-0 z-40 p-4 pb-safe"
          style="background: linear-gradient(to top, rgba(253,246,227,0.97) 60%, transparent);"
        >
          <div class="max-w-2xl mx-auto flex flex-col items-center gap-2">
            <p class="font-body text-wood-600 text-sm">
              {{ pendingSelections.size }} item(ns) selecionado(s)
            </p>
            <button
              class="btn-festive w-full max-w-sm text-base py-3.5"
              :disabled="claimLoading"
              @click="handleClaimItems"
            >
              <span v-if="claimLoading">Salvando... 🤝</span>
              <span v-else>🎁 Confirmar que vou trazer!</span>
            </button>
            <p v-if="claimError" class="text-sm text-red-500 font-body">
              Erro ao salvar. Tente novamente.
            </p>
          </div>
        </div>
      </Transition>

      <!-- ── Rodapé ────────────────────────────────────────── -->
      <footer class="bandeirinhas-bar mt-12 opacity-60" />
      <div class="py-6 text-center">
        <p class="font-body text-wood-400 text-xs">
          Feito com ❤️ para o Arraiau do Luiz · 2025
        </p>
      </div>
    </template>

    <!-- Modal de sucesso -->
    <ConfirmModal
      :show="showSuccessModal"
      :guest-name="guest?.name ?? ''"
      :claimed-item-name="lastClaimedItemName"
      @close="showSuccessModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'

import BandeirinhasHero from '@/components/BandeirinhasHero.vue'
import ItemCard         from '@/components/ItemCard.vue'
import LoadingSpinner   from '@/components/LoadingSpinner.vue'
import ConfirmModal     from '@/components/ConfirmModal.vue'

import {
  GET_GUEST,
  GET_ALL_ITEMS,
  CONFIRM_GUEST,
  UPDATE_GUEST,
  CLAIM_ITEM,
} from '@/graphql/queries'

// ── Rota ──────────────────────────────────────────────────
const route   = useRoute()
const guestId = computed(() => route.params.guestId)

// ── Query: dados do convidado ──────────────────────────────
const {
  result: guestResult,
  loading: guestLoading,
  error:   guestError,
  refetch: refetchGuest,
} = useQuery(GET_GUEST, () => ({ id: guestId.value }), {
  enabled: computed(() => !!guestId.value),
})

const guest = computed(() => guestResult.value?.guest ?? null)

// ── Query: todos os itens ──────────────────────────────────
const {
  result: itemsResult,
  loading: itemsLoading,
  refetch: refetchItems,
} = useQuery(GET_ALL_ITEMS)

const allItems = computed(() => itemsResult.value?.items ?? [])

// Agrupa por categoria
const itemsByCategory = computed(() => {
  return allItems.value.reduce((acc, item) => {
    const cat = item.category ?? 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})
})

// ── Estado: seleção de itens ───────────────────────────────
const selectedItemIds  = ref(new Set())
const pendingSelections = ref(new Set())

function handleToggleItem(item) {
  // Se já reivindicado por mim, remove (unclaim seria em outra sprint)
  if (item.claimedBy?.id === guest.value?.id) return

  const id = item.id
  const newSet = new Set(selectedItemIds.value)
  const newPending = new Set(pendingSelections.value)

  if (newSet.has(id)) {
    newSet.delete(id)
    newPending.delete(id)
  } else {
    newSet.add(id)
    newPending.add(id)
  }

  selectedItemIds.value  = newSet
  pendingSelections.value = newPending
}

// ── Mutation: confirmar presença ───────────────────────────
const plusOneCount    = ref(0)
const confirmLoading  = ref(false)
const confirmError    = ref(false)
const showSuccessModal = ref(false)
const lastClaimedItemName = ref('')

const { mutate: confirmGuestMutation } = useMutation(CONFIRM_GUEST)
const { mutate: updateGuestMutation }  = useMutation(UPDATE_GUEST)

async function handleConfirm() {
  if (!guest.value) return
  confirmLoading.value = true
  confirmError.value   = false
  try {
    // Confirma presença e salva quantidade de acompanhantes
    await Promise.all([
      confirmGuestMutation({ id: guest.value.id }),
      updateGuestMutation({ id: guest.value.id, input: { plusOne: plusOneCount.value } }),
    ])
    await refetchGuest()
    // Se não selecionou itens, mostra modal de boas-vindas mesmo assim
    if (pendingSelections.value.size === 0) {
      showSuccessModal.value = true
    }
  } catch (e) {
    console.error(e)
    confirmError.value = true
  } finally {
    confirmLoading.value = false
  }
}

// ── Mutation: reivindicar itens ────────────────────────────
const claimLoading = ref(false)
const claimError   = ref(false)

const { mutate: claimItemMutation } = useMutation(CLAIM_ITEM)

async function handleClaimItems() {
  if (!guest.value || pendingSelections.value.size === 0) return
  claimLoading.value = true
  claimError.value   = false

  const itemIds = [...pendingSelections.value]
  let lastName  = ''

  try {
    // Se ainda não confirmou, confirma junto
    if (!guest.value.confirmed) {
      await confirmGuestMutation({ id: guest.value.id })
    }

    for (const itemId of itemIds) {
      const result = await claimItemMutation({ itemId, guestId: guest.value.id })
      lastName = result?.data?.claimItem?.name ?? ''
    }

    lastClaimedItemName.value = itemIds.length === 1
      ? lastName
      : `${itemIds.length} itens`

    // Limpa seleção e refaz queries
    selectedItemIds.value   = new Set()
    pendingSelections.value = new Set()

    await Promise.all([refetchGuest(), refetchItems()])
    showSuccessModal.value = true
  } catch (e) {
    console.error(e)
    claimError.value = true
  } finally {
    claimLoading.value = false
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity   0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Safe-area para iPhones com notch na parte inferior */
.pb-safe {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
</style>
