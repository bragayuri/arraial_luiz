<template>
  <!-- Bandeirinhas decorativas desenhadas em SVG puro -->
  <svg
    :viewBox="`0 0 ${width} 48`"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    class="w-full"
    :style="{ height: '48px' }"
    aria-hidden="true"
  >
    <!-- Cordão -->
    <path
      :d="`M0 14 Q${width * 0.25} 20 ${width * 0.5} 14 Q${width * 0.75} 8 ${width} 14`"
      :stroke="cordColor"
      stroke-width="1.8"
      fill="none"
      stroke-opacity="0.8"
    />

    <!-- Bandeirinhas espaçadas ao longo do cordão -->
    <g v-for="(flag, i) in flags" :key="i">
      <!-- Cada bandeirinha é um triângulo isósceles -->
      <polygon
        :points="`${flag.x - 9},${flag.y - 2} ${flag.x + 9},${flag.y - 2} ${flag.x},${flag.y + 22}`"
        :fill="flag.color"
        :fill-opacity="inverted ? 0.85 : 0.9"
      />
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  inverted: { type: Boolean, default: false },
  width:    { type: Number, default: 1440 },
})

const cordColor = computed(() => props.inverted ? '#fdf6e3' : '#7c4e18')

const COLORS = ['#c0392b', '#f39c12', '#27ae60', '#2980b9', '#8e44ad', '#e67e22']

const flags = computed(() => {
  const count = 24
  const step  = props.width / count
  return Array.from({ length: count }, (_, i) => {
    const progress = i / (count - 1)
    // Curva senoidal suave
    const baseY = 14
    const amplitude = 6
    const y = baseY + Math.sin(progress * Math.PI * 2) * amplitude
    return {
      x:     step * i + step / 2,
      y:     y,
      color: COLORS[i % COLORS.length],
    }
  })
})
</script>
