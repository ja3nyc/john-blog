import React from 'react'
import { MDXContent as ContentCollectionsMDXContent } from '@content-collections/mdx/react'
import { mdxComponents } from './mdx'

interface MDXContentProps {
  code: string // Compiled MDX code from content-collections
}

export function MDXContent({ code }: MDXContentProps) {
  return (
    <ContentCollectionsMDXContent 
      code={code} 
      components={mdxComponents} 
    />
  )
}