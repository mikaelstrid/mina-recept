import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // server-only is a Next.js guard that has no runtime effect in tests
      'server-only': resolve(__dirname, 'tests/__mocks__/server-only.ts'),
    },
  },
})
