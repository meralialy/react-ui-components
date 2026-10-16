import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Library build: the components as an npm package, in dist/. The docs site has its own build
// (vite.config.ts → dist-docs/).
export default defineConfig({
  plugins: [react()],
  // The docs site's public/ files (favicon etc.) don't belong in the package
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    // Leave minifying to the consuming app's bundler; readable output is easier to debug
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rolldownOptions: {
      // Provided by the consuming app (peer dependencies). Bundling them would create a second
      // copy of React or styled-components, which breaks hooks and theming.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^styled-components($|\/)/],
      output: {
        // One file per source module, so apps only bundle the components they import
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // The components use hooks, so frameworks with server components (e.g. Next.js App
        // Router) must treat them as client code
        banner: "'use client';",
      },
    },
  },
})
