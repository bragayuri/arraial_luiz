<template>
  <div class="space-y-6">
    <!-- Formulário de adicionar / editar item -->
    <div class="bg-white/80 rounded-2xl border border-wood-200 shadow-card p-6">
      <h3 class="font-display text-lg text-bark mb-4">
        {{ editingItem ? '✏️ Editar Item' : '➕ Novo Insumo' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="grid sm:grid-cols-2 gap-4">
        <!-- Nome -->
        <div class="sm:col-span-2">
          <label class="block font-body text-sm text-wood-600 mb-1.5">Nome do item *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Ex: Bolo de Milho, Pinhão, Pamonha..."
            required
            class="input-field w-full"
          />
        </div>

        <!-- Descrição -->
        <div class="sm:col-span-2">
          <label class="block font-body text-sm text-wood-600 mb-1.5">Descrição <span class="text-wood-400">(opcional)</span></label>
          <input
            v-model="form.description"
            type="text"
            placeholder="Ex: Para 10 pessoas, sem glúten..."
            class="input-field w-full"
          />
        </div>

        <!-- Categoria -->
        <div>
          <label class="block font-body text-sm text-wood-600 mb-1.5">Categoria</label>
          <select v-model="form.category" class="input-field w-full">
            <option value="">Selecionar...</option>
            <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Quantidade -->
        <div>
          <label class="block font-body text-sm text-wood-600 mb-1.5">Quantidade</label>
          <input
            v-model.number="form.quantity"
            type="number"
            min="1"
            max="999"
            class="input-field w-full"
          />
        </div>

        <!-- Ações do form -->
        <div class="sm:col-span-2 flex gap-3 pt-1">
          <button type="submit" class="btn-festive py-2.5 px-6 text-sm" :disabled="!form.name || saving">
            <span v-if="saving">Salvando...</span>
            <span v-else-if="editingItem">💾 Salvar alterações</span>
            <span v-else>🌽 Adicionar item</span>
          </button>
          <button
            v-if="editingItem"
            type="button"
            class="btn-outline py-2.5 px-5 text-sm"
            @click="cancelEdit"
          >
            Cancelar
          </button>
        </div>
      </form>

      <p v-if="formError" class="mt-3 text-sm text-red-500 font-body">{{ formError }}</p>
    </div>

    <!-- Lista de itens -->
    <div class="bg-white/80 rounded-2xl border border-wood-200 shadow-card overflow-hidden">
      <div class="px-6 py-4 border-b border-wood-100 flex items-center justify-between">
        <h3 class="font-display text-lg text-bark">Lista de Insumos</h3>
        <span class="category-badge">{{ items.length }} itens</span>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-12 gap-3">
        <span class="text-3xl animate-spin" style="animation-duration:1.4s">🌽</span>
        <span class="font-body text-wood-400 text-sm">Carregando...</span>
      </div>

      <div v-else-if="items.length === 0" class="text-center py-12">
        <div class="text-4xl mb-3">📦</div>
        <p class="font-body text-wood-400 text-sm">Nenhum item cadastrado ainda.</p>
      </div>

      <!-- Agrupado por categoria -->
      <div v-else>
        <div
          v-for="(catItems, category) in byCategory"
          :key="category"
          class="border-b border-wood-50 last:border-0"
        >
          <!-- Header da categoria -->
          <div class="px-6 py-2.5 bg-wood-50/60 flex items-center gap-2">
            <span class="text-sm">{{ categoryEmoji(category) }}</span>
            <span class="font-body text-xs font-semibold text-wood-600 uppercase tracking-wider">
              {{ category }}
            </span>
            <span class="ml-auto font-body text-xs text-wood-400">{{ catItems.length }}</span>
          </div>

          <!-- Itens da categoria -->
          <div class="divide-y divide-wood-50">
            <div
              v-for="item in catItems"
              :key="item.id"
              class="flex items-center gap-3 px-6 py-3.5 hover:bg-wood-50/30 transition-colors group"
            >
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="font-body font-semibold text-bark text-sm flex items-center gap-2">
                  {{ item.name }}
                  <span v-if="item.quantity > 1" class="font-normal text-wood-400 text-xs">
                    ×{{ item.quantity }}
                  </span>
                </div>
                <div v-if="item.description" class="text-xs text-wood-400 mt-0.5 truncate">
                  {{ item.description }}
                </div>
              </div>

              <!-- Status de quem vai trazer -->
              <div class="shrink-0 text-right">
                <span
                  v-if="item.claimedBy"
                  class="inline-flex items-center gap-1 text-xs font-body
                         bg-green-50 text-green-700 px-2.5 py-1 rounded-full"
                >
                  ✅ {{ item.claimedBy.name.split(' ')[0] }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 text-xs font-body
                         bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full"
                >
                  ⏳ Disponível
                </span>
              </div>

              <!-- Ações -->
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  class="p-1.5 rounded-lg hover:bg-wood-100 text-wood-400 hover:text-wood-700 transition-colors"
                  @click="startEdit(item)"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                </button>
                <button
                  class="p-1.5 rounded-lg hover:bg-red-100 text-wood-400 hover:text-red-600 transition-colors"
                  @click="$emit('delete-item', item)"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items:   { type: Array,   default: () => [] },
  loading: { type: Boolean, default: false },
  saving:  { type: Boolean, default: false },
})

const emit = defineEmits(['submit-item', 'delete-item'])

const CATEGORIES = ['Comida', 'Bebida', 'Doce', 'Decoração', 'Música', 'Outros']

const EMOJI_MAP = {
  'Comida':    '🍗',
  'Bebida':    '🍹',
  'Doce':      '🍬',
  'Decoração': '🎀',
  'Música':    '🎶',
  'Outros':    '📦',
}
const categoryEmoji = (cat) => EMOJI_MAP[cat] ?? '📦'

// ── Formulário ────────────────────────────────────────────
const editingItem = ref(null)
const formError   = ref('')

const emptyForm = () => ({ name: '', description: '', category: '', quantity: 1 })
const form = ref(emptyForm())

function startEdit(item) {
  editingItem.value = item
  form.value = {
    name:        item.name,
    description: item.description ?? '',
    category:    item.category ?? '',
    quantity:    item.quantity,
  }
  // Scroll pro topo do form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingItem.value = null
  form.value = emptyForm()
  formError.value = ''
}

function handleSubmit() {
  formError.value = ''
  if (!form.value.name.trim()) {
    formError.value = 'Nome do item é obrigatório.'
    return
  }

  emit('submit-item', {
    editing: editingItem.value,
    data:    { ...form.value, quantity: form.value.quantity || 1 },
  })

  // Reset imediato — não espera o parent confirmar (optimistic UX)
  editingItem.value = null
  form.value = emptyForm()
}

// ── Agrupamento por categoria ─────────────────────────────
const byCategory = computed(() => {
  return props.items.reduce((acc, item) => {
    const cat = item.category || 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})
})
</script>

<style>
.input-field {
  @apply px-4 py-2.5 rounded-xl border border-wood-200 bg-cream
         font-body text-sm text-bark placeholder-wood-300 outline-none
         focus:border-wood-400 focus:ring-2 focus:ring-wood-100 transition-colors;
}
</style>
