import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The docs site. The component package has its own build: vite.lib.config.ts → dist/.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-docs',
  },
})
