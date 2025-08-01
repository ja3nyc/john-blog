import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getAllPosts, getAllUniqueTags } from '~/utils/markdown.server'
import { type BlogPostMeta } from '~/utils/markdown'
import { RelativeTime } from '~/components/RelativeTime'
import { seo } from '~/utils/seo'
import { getAbsoluteUrl } from '~/utils/url'
import { useState, useMemo } from 'react'

const getPostsAndTags = createServerFn()
  .handler(async () => {
    const allPosts = await getAllPosts()
    const allTags = await getAllUniqueTags()
    
    return {
      posts: allPosts,
      allTags
    }
  })

export const Route = createFileRoute('/blog/')({
  component: Blog,
  loader: () => getPostsAndTags(),
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
  const { posts: allPosts, allTags } = Route.useLoaderData()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Filter posts based on selected tags
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) {
      return allPosts
    }
    return allPosts.filter(post => 
      selectedTags.some(selectedTag => post.tags.includes(selectedTag))
    )
  }, [allPosts, selectedTags])

  const handleTagClick = (tag: string) => {
    setSelectedTags(current => {
      const isSelected = current.includes(tag)
      if (isSelected) {
        return current.filter(t => t !== tag)
      } else {
        return [...current, tag]
      }
    })
  }

  const clearAllTags = () => {
    setSelectedTags([])
  }

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

      {/* Tag Filtering Section */}
      {allTags.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Filter by topic</h3>
            {selectedTags.length > 0 && (
              <button
                onClick={clearAllTags}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`
                    px-3 py-1 text-xs border transition-all duration-200
                    ${isSelected
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground'
                    }
                  `}
                >
                  {tag}
                </button>
              )
            })}
          </div>
          {selectedTags.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} tagged with {selectedTags.map((tag, index) => (
                <span key={tag}>
                  "{tag}"{index < selectedTags.length - 1 ? (index === selectedTags.length - 2 ? ' or ' : ', ') : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: BlogPostMeta) => (
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
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground/60">
                          +{post.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : selectedTags.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="space-y-4 max-w-md">
              <h3 className="text-lg font-medium text-foreground">
                No posts found
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                No posts match the selected tags. Try exploring other topics or{' '}
                <button 
                  onClick={clearAllTags}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  clear the filters
                </button>{' '}
                to see all posts.
              </p>
            </div>
          </div>
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
