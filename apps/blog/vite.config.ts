import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import contentCollections from '@content-collections/vite'

export default defineConfig({
  plugins: [
    contentCollections(),
    tsconfigPaths(),
    tanstackStart({ 
      target: 'bun',
      customViteReactPlugin: true 
    }),
    viteReact()
  ],
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: ['react-tweet'],
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
})


