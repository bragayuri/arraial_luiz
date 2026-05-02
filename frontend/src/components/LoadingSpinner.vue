<template>
  <div class="flex flex-col items-center justify-center py-20 gap-5">
    <!-- Milho girando como loader temático -->
    <div class="text-6xl animate-spin" style="animation-duration: 1.4s">🌽</div>
    <p class="font-body text-wood-500 text-sm animate-pulse">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: 'Carregando o arraial...' },
})
</script>
