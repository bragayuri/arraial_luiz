/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      // ── Paleta "Festa Junina Elegante" ──────────────────
      colors: {
        wood: {
          50:  '#fdf8f0',
          100: '#f8ecd8',
          200: '#f0d4a8',
          300: '#e4b876',
          400: '#d49a4a',
          500: '#b87d2e',   // madeira principal
          600: '#9a6420',
          700: '#7c4e18',
          800: '#5e3b12',
          900: '#3d260b',
        },
        festive: {
          red:    '#c0392b',  // vermelho bandeirinha
          yellow: '#f39c12',  // amarelo milho
          green:  '#27ae60',  // verde bandeirinha
          blue:   '#2980b9',  // azul bandeirinha
          purple: '#8e44ad',  // roxo chitão
        },
        cream: {
          DEFAULT: '#fdf6e3',
          dark:    '#f5e6c8',
        },
        bark: '#3d2b1f',       // texto escuro
      },

      // ── Fontes ──────────────────────────────────────────
      fontFamily: {
        display:  ['"Playfair Display"', 'Georgia', 'serif'],
        festive:  ['"Dancing Script"', 'cursive'],
        body:     ['Cabin', 'system-ui', 'sans-serif'],
      },

      // ── Sombras ─────────────────────────────────────────
      boxShadow: {
        wood:   '0 4px 24px -4px rgba(61,43,31,0.25)',
        card:   '0 2px 12px rgba(61,43,31,0.12)',
        glow:   '0 0 20px rgba(212,154,74,0.35)',
      },

      // ── Animações ───────────────────────────────────────
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':       { transform: 'rotate(3deg)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        wave:    'wave 2s ease-in-out infinite',
        fadeUp:  'fadeUp 0.6s ease both',
        shimmer: 'shimmer 2.5s linear infinite',
      },

      // ── Background patterns ─────────────────────────────
      backgroundImage: {
        'wood-grain': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b87d2e' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
