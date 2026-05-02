import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      // Dev URLs like `/src/Foo.vue` must resolve under this project. Otherwise some
      // clients pass `/src/...` into plugin-vue as an OS path (`readFileSync`) and
      // Node looks under filesystem `/src/` → ENOENT.
      { find: /^\/?src\/(.*)$/, replacement: `${srcDir}/$1` },
      { find: '@', replacement: srcDir },
    ],
  },
  server: {
    port: 5173,
  },
})
