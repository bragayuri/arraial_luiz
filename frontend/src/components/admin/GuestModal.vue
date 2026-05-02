<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <div class="absolute inset-0 bg-bark/50 backdrop-blur-sm" @click="$emit('close')" />

      <div class="relative bg-cream rounded-3xl shadow-wood w-full max-w-md p-7 animate-fadeUp border border-wood-200">
        <h3 class="font-display text-xl text-bark mb-5">
          {{ guest ? '✏️ Editar Convidado' : '👋 Novo Convidado' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block font-body text-sm text-wood-600 mb-1.5">Nome *</label>
            <input v-model="form.name" type="text" required placeholder="Nome completo" class="input-field w-full" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-body text-sm text-wood-600 mb-1.5">Telefone</label>
              <input v-model="form.phone" type="tel" placeholder="+353 ..." class="input-field w-full" />
            </div>
            <div>
              <label class="block font-body text-sm text-wood-600 mb-1.5">E-mail</label>
              <input v-model="form.email" type="email" placeholder="email@..." class="input-field w-full" />
            </div>
          </div>
          <div>
            <label class="block font-body text-sm text-wood-600 mb-1.5">Observações</label>
            <input v-model="form.notes" type="text" placeholder="Alguma restrição alimentar, etc." class="input-field w-full" />
          </div>
          <!-- Stepper de acompanhantes 0–5 -->
          <div>
            <label class="block font-body text-sm text-wood-600 mb-2">Acompanhantes (0–5)</label>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="w-9 h-9 rounded-full border-2 border-wood-300 font-bold text-wood-600 text-lg
                       flex items-center justify-center hover:border-wood-500 hover:bg-wood-50
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                :disabled="form.plusOne === 0"
                @click="form.plusOne = Math.max(0, form.plusOne - 1)"
              >−</button>
              <span class="font-display text-2xl text-bark min-w-[2rem] text-center">{{ form.plusOne }}</span>
              <button
                type="button"
                class="w-9 h-9 rounded-full border-2 border-wood-300 font-bold text-wood-600 text-lg
                       flex items-center justify-center hover:border-wood-500 hover:bg-wood-50
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                :disabled="form.plusOne === 5"
                @click="form.plusOne = Math.min(5, form.plusOne + 1)"
              >+</button>
              <span class="font-body text-sm text-wood-400 ml-1">
                {{ form.plusOne === 0 ? 'sozinho(a)' : form.plusOne === 1 ? 'acompanhante' : 'acompanhantes' }}
              </span>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" class="btn-festive flex-1 py-3" :disabled="saving">
              {{ saving ? 'Salvando...' : guest ? 'Salvar' : 'Adicionar' }}
            </button>
            <button type="button" class="btn-outline px-5 py-3" @click="$emit('close')">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show:   { type: Boolean, required: true },
  guest:  { type: Object,  default: null },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

const emptyForm = () => ({ name: '', phone: '', email: '', notes: '', plusOne: 0 })
const form = ref(emptyForm())

watch(() => props.guest, (g) => {
  form.value = g
    ? { name: g.name, phone: g.phone ?? '', email: g.email ?? '', notes: g.notes ?? '', plusOne: g.plusOne ?? 0 }
    : emptyForm()
}, { immediate: true })

function handleSubmit() {
  emit('submit', { guest: props.guest, data: { ...form.value } })
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
