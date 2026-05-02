<template>
  <!-- Modal de feedback pós-confirmação -->
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-6"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-bark/60 backdrop-blur-sm" />

      <!-- Card do modal -->
      <div
        class="relative bg-cream rounded-3xl shadow-wood max-w-sm w-full p-8 text-center
               border border-wood-200 animate-fadeUp"
      >
        <!-- Ícone animado -->
        <div class="text-7xl mb-5 leading-none">
          <span class="inline-block animate-wave">🎉</span>
        </div>

        <h2 class="font-festive text-4xl text-wood-700 mb-3">
          Uhuuul!
        </h2>
        <p class="font-body text-wood-600 leading-relaxed mb-6">
          <strong class="text-bark">{{ guestName }}</strong>,
          sua presença foi confirmada no <em>Arraiau do Luiz</em>!
          <br />
          <span v-if="claimedItemName" class="mt-2 inline-block text-sm">
            Você ficou de trazer <strong>{{ claimedItemName }}</strong>. Obrigado! 🙏
          </span>
        </p>

        <!-- Bandeirinhas decorativas -->
        <div class="bandeirinhas-bar mb-6 rounded-full overflow-hidden opacity-70" />

        <button
          class="btn-festive w-full"
          @click="$emit('close')"
        >
          Fechar 🌽
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show:            { type: Boolean, required: true },
  guestName:       { type: String,  default: '' },
  claimedItemName: { type: String,  default: '' },
})
defineEmits(['close'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
