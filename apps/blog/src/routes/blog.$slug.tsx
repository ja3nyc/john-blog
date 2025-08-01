import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type BlogPost } from '~/utils/markdown'
import { getPostBySlug } from '~/utils/markdown.server'
import { MDXContent } from '~/components/MDXContent'
import { RelativeTime } from '~/components/RelativeTime'
import { seo } from '~/utils/seo'
import { getAbsoluteUrl } from '~/utils/url'
import { calculateReadingTime } from '~/utils/reading-time'

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
        <div className="max-w-3xl mx-auto px-6 py-12">
            {/* Header */}
            <header className="space-y-6 mb-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4 text-base text-muted-foreground font-medium">
                            <RelativeTime 
                                date={post.date}
                                className=""
                            />
                            <span className="text-muted-foreground/60">•</span>
                            <span>{calculateReadingTime(post.content)}</span>
                        </div>
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-sm bg-muted text-muted-foreground border border-border"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </header>

            {/* Content */}
            <article className="prose prose-xl max-w-none
        prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight prose-headings:scroll-mt-20
        prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-16 prose-h1:first:mt-0
        prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:border-b prose-h2:border-border prose-h2:pb-3
        prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-10
        prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-8
        prose-p:text-foreground prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-lg prose-p:font-normal
        prose-a:text-foreground prose-a:underline prose-a:decoration-muted-foreground prose-a:underline-offset-4 hover:prose-a:decoration-foreground prose-a:transition-all prose-a:duration-200
        prose-strong:text-foreground prose-strong:font-semibold
        prose-em:text-foreground prose-em:italic
        prose-code:text-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:my-8
        prose-blockquote:border-l-4 prose-blockquote:border-l-border prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/30 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:font-medium
        prose-hr:border-border prose-hr:my-12 prose-hr:border-t-2
        prose-ul:text-foreground prose-ul:space-y-3 prose-ul:my-8
        prose-ol:text-foreground prose-ol:space-y-3 prose-ol:my-8
        prose-li:text-foreground prose-li:text-lg prose-li:leading-[1.8] prose-li:mb-2
        prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-border prose-img:my-8
        prose-table:border-collapse prose-table:border prose-table:border-border prose-table:my-8
        prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-3 prose-th:font-semibold
        prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3">
{post.type === 'mdx' ? (
          <MDXContent slug={post.slug} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </article>

            {/* Navigation */}
            <footer className="mt-16 pt-8 border-t border-border">
                <a 
                    href="/blog" 
                    className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to writing
                </a>
            </footer>
        </div>
    )
}
