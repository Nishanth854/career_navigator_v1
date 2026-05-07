import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This defines the port your frontend will run on
    port: 5173,
    // Proxy configuration: This is a "bridge" to your Python backend
    // It tells Vite that any request starting with /api should go to port 8001
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      // Allows you to use '@' as a shortcut for the 'src' folder in imports
      '@': '/src',
    },
  },
})