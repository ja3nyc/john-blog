import React, { lazy, Suspense } from 'react'
import { MDXRenderer } from './MDXRenderer'

// Import all MDX files statically to avoid dynamic import issues
const MDXComponents = {
  'mdx-components-showcase': lazy(() => import('../../content/mdx/mdx-components-showcase.mdx')),
  'tanstack-vs-nextjs': lazy(() => import('../../content/mdx/tanstack-vs-nextjs.mdx')),
}

interface MDXContentProps {
  slug: string
}

export function MDXContent({ slug }: MDXContentProps) {
  const Component = MDXComponents[slug as keyof typeof MDXComponents]
  
  if (!Component) {
    return <div>MDX content not found for: {slug}</div>
  }

  return (
    <MDXRenderer>
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <Component />
      </Suspense>
    </MDXRenderer>
  )
}