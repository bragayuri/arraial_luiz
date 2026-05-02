<template>
  <article
    :class="[
      'item-card select-none relative overflow-hidden',
      isTakenByOther ? 'cursor-default' : 'cursor-pointer',
      isTakenByOther && !showClaimedMsg ? 'opacity-70' : '',
      isSelected ? 'selected' : '',
      isClaimedByMe ? 'ring-2 ring-festive-green/40 border-festive-green/50' : '',
    ]"
    @click="handleClick"
    :aria-disabled="isTakenByOther"
    role="button"
    :tabindex="isTakenByOther ? 0 : 0"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- ── Overlay "Item escolhido" (aparece ao clicar item tomado) ── -->
    <Transition name="claimed-flash">
      <div
        v-if="showClaimedMsg"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center
               bg-white/95 backdrop-blur-sm rounded-2xl text-center px-4"
      >
        <span class="text-3xl mb-2">🔒</span>
        <p class="font-display text-bark text-sm font-bold leading-snug mb-1">
          Item escolhido<br>por um convidado!
        </p>
        <p class="font-body text-wood-400 text-xs">
          {{ item.claimedBy?.name?.split(' ')[0] }} já reservou este item.
        </p>
      </div>
    </Transition>

    <!-- Header: nome + badge de categoria -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <h3 class="font-display font-bold text-bark text-lg leading-tight flex-1">
        {{ item.name }}
      </h3>
      <span v-if="item.category" class="category-badge shrink-0">
        {{ categoryEmoji }} {{ item.category }}
      </span>
    </div>

    <!-- Descrição -->
    <p v-if="item.description" class="text-sm text-wood-600 mb-3 leading-relaxed">
      {{ item.description }}
    </p>

    <!-- Footer: quantidade + status -->
    <div class="flex items-center justify-between mt-auto pt-2 border-t border-wood-100">
      <span class="text-xs text-wood-500 font-body">
        Qtd: <strong class="text-wood-700">{{ item.quantity }}</strong>
      </span>

      <span :class="statusClass" class="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full">
        <span>{{ statusIcon }}</span>
        <span>{{ statusText }}</span>
      </span>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item:           { type: Object,  required: true },
  isSelected:     { type: Boolean, default: false },
  currentGuestId: { type: String,  default: null },
})

const emit = defineEmits(['toggle'])

const isClaimedByMe = computed(
  () => props.item.claimedBy?.id === props.currentGuestId
)
const isTakenByOther = computed(
  () => !!props.item.claimedBy && !isClaimedByMe.value
)

// Overlay temporário ao clicar num item já tomado
const showClaimedMsg = ref(false)
let hideTimer = null

function handleClick() {
  if (isTakenByOther.value) {
    // Mostra o overlay "Item escolhido por um convidado!" por 2s
    showClaimedMsg.value = true
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => { showClaimedMsg.value = false }, 2000)
    return
  }
  emit('toggle', props.item)
}

const CATEGORY_EMOJIS = {
  'Comida':    '🍗',
  'Bebida':    '🍹',
  'Decoração': '🎀',
  'Música':    '🎶',
  'Doce':      '🍬',
  'default':   '📦',
}
const categoryEmoji = computed(
  () => CATEGORY_EMOJIS[props.item.category] ?? CATEGORY_EMOJIS.default
)

const statusClass = computed(() => {
  if (isClaimedByMe.value)  return 'bg-green-100 text-green-700'
  if (isTakenByOther.value) return 'bg-wood-100 text-wood-500'
  if (props.isSelected)     return 'bg-wood-500 text-white'
  return 'bg-cream text-wood-600 border border-wood-200'
})
const statusIcon = computed(() => {
  if (isClaimedByMe.value)  return '✅'
  if (isTakenByOther.value) return '🔒'
  if (props.isSelected)     return '☑️'
  return '⬜'
})
const statusText = computed(() => {
  if (isClaimedByMe.value)  return 'Você vai trazer!'
  if (isTakenByOther.value) return `${props.item.claimedBy.name.split(' ')[0]} vai trazer`
  if (props.isSelected)     return 'Selecionado'
  return 'Disponível'
})
</script>

<style scoped>
.claimed-flash-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.claimed-flash-leave-active { transition: opacity 0.25s ease; }
.claimed-flash-enter-from   { opacity: 0; transform: scale(0.96); }
.claimed-flash-leave-to     { opacity: 0; }
</style>
