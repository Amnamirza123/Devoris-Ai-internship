import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
=======
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "http://localhost:3000/"
    ]
  }
>>>>>>> 18f3828ee7fb9884f99719ee0d662a0189589820
})
