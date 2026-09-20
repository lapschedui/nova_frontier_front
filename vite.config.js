import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Если мы собираем проект для GitHub Pages, используем имя репозитория,
  // иначе (в режиме разработки) оставляем корень '/'
  base: command === 'build' ? '/nova_frontier_front/' : '/',

  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
}))
