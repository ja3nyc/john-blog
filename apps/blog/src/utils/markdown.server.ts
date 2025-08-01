import { allPosts } from 'content-collections'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  content?: string
  mdx?: any
  type: 'mdx'
}

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  // Content collections handles all the file reading and frontmatter parsing
  return allPosts
    .map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      tags: post.tags,
    }))
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = allPosts.find(p => p.slug === slug)
  
  if (!post) {
    return null
  }

  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags,
    content: post.content,
    mdx: post.mdx,
    type: 'mdx',
  }
}

export async function getAllUniqueTags(): Promise<string[]> {
  const tagSet = new Set<string>()
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagSet.add(tag)
    })
  })
  
  return Array.from(tagSet).sort()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}