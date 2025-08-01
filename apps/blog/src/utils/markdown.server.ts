import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  content: string
  mdxSource?: any // Serialized MDX from next-mdx-remote
  type?: 'md' | 'mdx'
}

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

function getPostsDirectory() {
  return path.join(process.cwd(), 'content/blog')
}

function getMdxDirectory() {
  return path.join(process.cwd(), 'content/mdx')
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const postsDirectory = getPostsDirectory()
  const mdxDirectory = getMdxDirectory()
  
  // Get both .md and .mdx files
  const mdFiles = fs.existsSync(postsDirectory) ? fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md')) : []
  const mdxFiles = fs.existsSync(mdxDirectory) ? fs.readdirSync(mdxDirectory).filter(f => f.endsWith('.mdx')) : []
  
  const allPostsData = [
    ...mdFiles.map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        excerpt: matterResult.data.excerpt,
        tags: matterResult.data.tags || [],
        type: 'md' as const,
      }
    }),
    ...mdxFiles.map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(mdxDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        excerpt: matterResult.data.excerpt,
        tags: matterResult.data.tags || [],
        type: 'mdx' as const,
      }
    })
  ]

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const postsDirectory = getPostsDirectory()
    const mdxDirectory = getMdxDirectory()
    
    // Try .mdx first, then .md
    let fullPath = path.join(mdxDirectory, `${slug}.mdx`)
    let isMdx = true
    
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${slug}.md`)
      isMdx = false
      
      if (!fs.existsSync(fullPath)) {
        return null
      }
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    let contentHtml: string
    
    let mdxSource: any = undefined
    
    if (isMdx) {
      // Process MDX with next-mdx-remote
      mdxSource = await serialize(matterResult.content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeHighlight,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }]
          ],
        },
      })
      contentHtml = '' // We'll use mdxSource instead
    } else {
      // Process regular markdown
      const processedContent = await remark()
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .process(matterResult.content)
      
      contentHtml = processedContent.toString()
    }

    return {
      slug,
      title: matterResult.data.title,
      date: matterResult.data.date,
      excerpt: matterResult.data.excerpt,
      tags: matterResult.data.tags || [],
      content: contentHtml,
      mdxSource: mdxSource,
      type: isMdx ? 'mdx' : 'md',
    }
  } catch (error) {
    console.error('Error processing post:', error)
    return null
  }
}

export async function getAllUniqueTags(): Promise<string[]> {
  const allPosts = await getAllPosts()
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
