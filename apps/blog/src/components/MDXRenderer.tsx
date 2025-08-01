import { MDXRemote } from 'next-mdx-remote'
import { mdxComponents } from './mdx'

const components = {
  ...mdxComponents,
}

interface MDXRendererProps {
  source: any // Serialized MDX source from next-mdx-remote
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return <MDXRemote {...source} components={components} />
}
