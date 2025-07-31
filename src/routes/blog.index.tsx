import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getAllPosts } from '~/utils/markdown.server'
import { type BlogPostMeta } from '~/utils/markdown'
import { RelativeTime } from '~/components/RelativeTime'
import { seo } from '~/utils/seo'
import { getAbsoluteUrl } from '~/utils/url'

const getPosts = createServerFn()
  .handler(async () => {
    // Import server-only modules inside the handler
    return await getAllPosts()
  })

export const Route = createFileRoute('/blog/')({
  component: Blog,
  loader: () => getPosts(),
  head: () => {
    const ogImageUrl = getAbsoluteUrl('/api/og/blog');
    
    return {
      meta: [
        ...seo({
          title: 'Blog - John Annunziato',
          description: 'Thoughts on software development, technology, and more.',
          image: ogImageUrl,
        }),
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Blog - John Annunziato' },
      ],
    };
  },
})

function Blog() {
  const posts = Route.useLoaderData()

  return (
    <div className="space-y-12">
      <div className="py-8">
        <h1 className="text-2xl font-medium text-foreground mb-4">
          Writing
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Thoughts on development, technology, and things I'm learning.
        </p>
      </div>

      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post: BlogPostMeta) => (
            <article key={post.slug} className="group">
              <div className="space-y-3">
                <h2 className="text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                  <a href={`/blog/${post.slug}`} className="cursor-pointer">
                    {post.title}
                  </a>
                </h2>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <RelativeTime 
                    date={post.date}
                    className="text-xs text-muted-foreground"
                  />
                  {post.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="space-y-4 max-w-md">
              <h3 className="text-lg font-medium text-foreground">
                Coming Soon
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                I'm working on some exciting content to share with you. 
                Check back soon for insights on development, technology, and more!
              </p>
              <div className="pt-4">
                <div className="text-xs text-muted-foreground">
                  <span>New posts coming soon</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
