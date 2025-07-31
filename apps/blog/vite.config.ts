import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      target: 'bun',
      customViteReactPlugin: true,
    }),
    viteReact()
  ],
  server: {
    port: 3000,
  },
})


