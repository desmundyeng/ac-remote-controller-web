import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
        '/api': {
            target: 'https://localhost:3443',
                changeOrigin: true,
                secure: false, // Accept self-signed certificates
                rewrite: path => path.replace(/^\/api/, '')
        }
    }
}
})
