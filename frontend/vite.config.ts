import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
    proxy: {
      '/socket.io': {
        target: 'http://backend:8080',
        changeOrigin: true,
        ws: true,
      }
    },
    fs: {
      strict: true,
      allow: [
        // Your project root directory
        path.resolve(__dirname),
      ]
    },
  },
})