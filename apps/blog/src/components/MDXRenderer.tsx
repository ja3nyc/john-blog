import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from './mdx'

const components = {
  ...mdxComponents,
}

interface MDXRendererProps {
  children: React.ReactNode
}

export function MDXRenderer({ children }: MDXRendererProps) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
