import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    {
      ...mdx({
        remarkPlugins: [remarkGfm, remarkFrontmatter],
        rehypePlugins: [
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ],
        providerImportSource: '@mdx-js/react',
      }),
      enforce: 'pre'
    },
    tanstackStart({
      target: 'bun',
      customViteReactPlugin: true,
    }),
    viteReact({
      include: /\.(jsx|js|tsx|ts)$/,
      exclude: /\.mdx$/,
    })
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


