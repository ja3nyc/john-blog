import React, { useState, useEffect } from 'react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { mdxComponents } from './mdx'

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function compileContent() {
      try {
        const { default: MDXComponent } = await evaluate(content, {
          ...runtime,
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeHighlight,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }]
          ],
          development: process.env.NODE_ENV === 'development'
        })
        
        // Create a wrapper component that provides the MDX components
        const WrappedComponent = (props: any) => (
          <MDXComponent components={mdxComponents} {...props} />
        )
        
        setComponent(() => WrappedComponent)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to compile MDX')
      }
    }

    compileContent()
  }, [content])

  if (error) {
    return <div className="text-red-500">Error compiling MDX: {error}</div>
  }

  if (!Component) {
    return <div className="animate-pulse">Loading...</div>
  }

  return <Component />
}