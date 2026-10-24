import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Относительные пути — сайт работает из подкаталога GitHub Pages
  base: './',
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
