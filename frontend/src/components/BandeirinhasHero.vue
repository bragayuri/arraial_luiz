<template>
  <!-- Hero section com foto, bandeirinhas e título -->
  <section class="relative w-full overflow-hidden" style="min-height: 70vh;">

    <!-- Imagem de fundo com overlay gradiente -->
    <div class="absolute inset-0">
      <img
        src="@/assets/hero.webp"
        alt="Arraial do Luiz"
        class="w-full h-full object-cover"
        loading="eager"
      />
      <!-- Overlay escurecido na parte inferior para o texto se destacar -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(
          to bottom,
          rgba(61,43,31,0.15) 0%,
          rgba(61,43,31,0.35) 50%,
          rgba(61,43,31,0.82) 100%
        );"
      ></div>
    </div>

    <!-- Bandeirinhas no topo -->
    <div class="absolute top-0 left-0 right-0 z-10">
      <BandeirinhasSvg />
    </div>

    <!-- Conteúdo do Hero -->
    <div
      class="relative z-10 flex flex-col items-center justify-end h-full pb-14 px-6 text-center"
      style="min-height: 70vh;"
    >
      <!-- Tag "Você está convidado" -->
      <span
        class="animate-fadeUp inline-block mb-4 px-5 py-1.5 rounded-full
               bg-wood-400/80 backdrop-blur-sm text-white text-sm font-body font-semibold
               tracking-widest uppercase border border-wood-300/50"
        style="animation-delay: 0.1s"
      >
        ✦ Você está convidado ✦
      </span>

      <!-- Título principal -->
      <h1
        class="animate-fadeUp font-festive text-white text-shadow-festive leading-tight mb-3"
        style="font-size: clamp(3rem, 10vw, 6rem); animation-delay: 0.25s"
      >
        Arraial do Luiz
      </h1>

      <!-- Subtítulo / data -->
      <p
        class="animate-fadeUp font-display italic text-cream-dark text-xl md:text-2xl mb-6"
        style="animation-delay: 0.4s"
      >
        Um dia de festa, dança típica, brasilidades e muita alegria!
      </p>

      <!-- Detalhes da festa -->
      <div
        class="animate-fadeUp flex flex-wrap justify-center gap-4 text-sm text-white/90 font-body"
        style="animation-delay: 0.55s"
      >
        <span class="flex items-center gap-1.5">
          <span>📅</span> {{ partyDate }}
        </span>
        <span class="text-wood-300">•</span>
        <span class="flex items-center gap-1.5">
          <span>🕖</span> {{ partyTime }}
        </span>
        <span class="text-wood-300">•</span>
        <a
          v-if="partyLocationUrl"
          :href="partyLocationUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 underline underline-offset-2 decoration-white/50
                 hover:decoration-white transition-all"
        >
          <span>📍</span> {{ partyLocation }}
        </a>
        <span v-else class="flex items-center gap-1.5">
          <span>📍</span> {{ partyLocation }}
        </span>
      </div>
    </div>

    <!-- Bandeirinhas na base do hero -->
    <div class="absolute bottom-0 left-0 right-0 z-10" style="transform: rotate(180deg)">
      <BandeirinhasSvg :inverted="true" />
    </div>
  </section>
</template>

<script setup>
import BandeirinhasSvg from './BandeirinhasSvg.vue'

defineProps({
  partyDate:        { type: String, default: 'Sábado, 6 de Junho de 2025' },
  partyTime:        { type: String, default: 'A partir das 16h' },
  partyLocation:    { type: String, default: 'Ver no Google Maps' },
  partyLocationUrl: { type: String, default: null },
})
</script>
