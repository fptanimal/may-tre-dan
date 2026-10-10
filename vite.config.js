import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { danWorkflowPlugin } from './server/dan-ai/vite-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  logLevel: 'error',
  plugins: [
    danWorkflowPlugin(),
    react(),
  ]
});
