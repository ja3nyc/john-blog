import { MDXRemote } from 'next-mdx-remote'
import { Counter } from './mdx/Counter'
import { CodeBlock } from './mdx/CodeBlock'
import { Callout } from './mdx/Callout'

const components = {
  Counter,
  CodeBlock,
  Callout,
}

interface MDXRendererProps {
  source: any // Serialized MDX source from next-mdx-remote
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return <MDXRemote {...source} components={components} />
}
