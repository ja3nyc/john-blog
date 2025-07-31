import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type BlogPost } from '~/utils/markdown'
import { getPostBySlug } from '~/utils/markdown.server'
import { MDXRenderer } from '~/components/MDXRenderer'
import { RelativeTime } from '~/components/RelativeTime'
import { seo } from '~/utils/seo'
import { getAbsoluteUrl } from '~/utils/url'

const getPost = createServerFn()
    .validator((slug: string) => slug)
    .handler(async ({ data: slug }) => {
        // Import server-only modules inside the handler

        const post = await getPostBySlug(slug)
        if (!post) {
            throw notFound()
        }
        return post
    })

export const Route = createFileRoute('/blog/$slug')({
    component: BlogPost,
    loader: ({ params }) => getPost({ data: params.slug }),
    head: ({ params, loaderData }) => {
        const post = loaderData as BlogPost;
        const ogImageUrl = getAbsoluteUrl(`/api/og/blog/${params.slug}`);
        
        return {
            meta: [
                ...seo({
                    title: post.title,
                    description: post.excerpt,
                    image: ogImageUrl,
                }),
                { property: 'og:image:width', content: '1200' },
                { property: 'og:image:height', content: '630' },
                { property: 'og:image:alt', content: post.title },
                { property: 'og:type', content: 'article' },
                { property: 'article:published_time', content: post.date },
                { property: 'article:author', content: 'John Annunziato' },
            ],
        };
    },
})

function BlogPost() {
    const post = Route.useLoaderData()

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="space-y-4">
                <div className="space-y-2">
                    <h1 className="text-2xl font-medium text-foreground">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-between">
                        <RelativeTime 
                            date={post.date}
                            className="text-sm text-muted-foreground"
                        />
                        {post.tags.length > 0 && (
                            <div className="flex gap-3">
                                {post.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="text-sm text-muted-foreground"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <article className="prose max-w-none
        prose-headings:font-medium prose-headings:text-foreground
        prose-p:text-foreground prose-p:leading-relaxed
        prose-a:text-foreground prose-a:no-underline hover:prose-a:text-muted-foreground prose-a:transition-colors
        prose-strong:text-foreground prose-strong:font-medium
        prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
        prose-blockquote:border-l-border prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
        prose-hr:border-border
        prose-ul:text-foreground
        prose-ol:text-foreground
        prose-li:text-foreground
        prose-h1:text-foreground
        prose-h2:text-foreground
        prose-h3:text-foreground
        prose-h4:text-foreground">
        {(post as any).type === 'mdx' ? (
          <MDXRenderer source={(post as any).mdxSource} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </article>

            {/* Navigation */}
            <footer className="pt-8 border-t border-border">
                <a 
                    href="/blog" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to writing
                </a>
            </footer>
        </div>
    )
}
