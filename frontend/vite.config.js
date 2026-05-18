import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/profile': 'http://localhost:8080',
      '/platforms': 'http://localhost:8080',
      '/contest': 'http://localhost:8080',
      '/problem-of-the-day': 'http://localhost:8080',
      '/compiler': 'http://localhost:8080',
    }
  }
})
