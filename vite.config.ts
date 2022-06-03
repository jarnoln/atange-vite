/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// https://vitest.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom'
  }
})
