import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Ini kuncinya: Semua request yang berawalan '/api'
      // akan diteruskan ke Backend di port 6543
      '/api': {
        target: 'http://https://alimukti.pythonanywhere.com', // Sesuai development.ini backend kamu
        changeOrigin: true,
        secure: false,
      }
    }
  }
})