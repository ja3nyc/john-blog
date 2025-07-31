import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type BlogPostMeta } from '~/utils/markdown'
import { getAllPosts } from '~/utils/markdown.server'
import { RelativeTime } from '~/components/RelativeTime'
import { seo } from '~/utils/seo'
import { getAbsoluteUrl } from '~/utils/url'

const getRecentPosts = createServerFn()
  .handler(async () => {
    // Import server-only modules inside the handler
    const posts = await getAllPosts()
    return posts.slice(0, 3) // Get the 3 most recent posts
  })

export const Route = createFileRoute('/')({  
  component: Home, 
  loader: () => getRecentPosts(),
  head: () => {
    const ogImageUrl = getAbsoluteUrl('/api/og/home');
    
    return {
      meta: [
        ...seo({
          title: 'John Annunziato - Software Engineer & Founder',
          description: 'Personal blog and portfolio of John Annunziato, software engineer and founder.',
          image: ogImageUrl,
        }),
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'John Annunziato - Software Engineer & Founder' },
      ],
    };
  },
})

function Home() {
  const posts = Route.useLoaderData()
  return (
    <div className="space-y-16">
      {/* Minimal intro */}
      <section className="py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-normal text-foreground mb-6">
              I'm a full-stack developer building web applications.
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Currently focused on React, TypeScript, and Node.js. I write about development, 
              share what I'm learning, and document interesting problems I solve.
            </p>
          </div>
        </div>
      </section>

      {/* Recent writing */}
      <section>
        <div className="space-y-8">
          <h2 className="text-lg font-medium text-foreground">
            Recent writing
          </h2>
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post: BlogPostMeta) => (
                <article key={post.slug} className="group">
                  <div className="space-y-2">
                    <h3 className="text-foreground group-hover:text-muted-foreground transition-colors">
                      <a href={`/blog/${post.slug}`} className="cursor-pointer">
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <RelativeTime 
                      date={post.date}
                      className="text-xs text-muted-foreground"
                    />
                  </div>
                </article>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="space-y-3 max-w-sm">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    I'm currently working on some articles to share. 
                    Check back soon for insights on development and technology!
                  </p>
                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground">
                      <span>Content coming soon</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {posts.length > 0 && (
            <div className="pt-4">
              <a 
                href="/blog" 
                className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                All posts →
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
