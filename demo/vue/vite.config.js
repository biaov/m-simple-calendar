import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: import.meta.dirname,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': import.meta.dirname
    }
  },
  server: {
    host: '0.0.0.0'
  }
})
