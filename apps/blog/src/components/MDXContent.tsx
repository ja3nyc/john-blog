import React, { Suspense } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from './mdx'

interface MDXContentProps {
  slug: string
}

// Dynamic imports for MDX files - Vite will handle these properly
const importMDX = (slug: string) => {
  // Use dynamic import with template literal - Vite can analyze this
  return import(`../../content/mdx/${slug}.mdx`)
}

export function MDXContent({ slug }: MDXContentProps) {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    importMDX(slug)
      .then((module) => {
        setComponent(() => module.default)
      })
      .catch((err) => {
        setError(err.message)
      })
  }, [slug])

  if (error) {
    return <div className="text-red-500">Error loading MDX: {error}</div>
  }

  if (!Component) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <MDXProvider components={mdxComponents}>
      <Component />
    </MDXProvider>
  )
}