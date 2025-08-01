import { Tweet as RTweet } from 'react-tweet'
import { cn } from '~/lib/utils'

interface TweetProps {
  id: string
  className?: string
  align?: 'left' | 'center' | 'right'
  theme?: 'light' | 'dark' | 'auto'
}

export function Tweet({ id, className, align = 'center', theme = 'auto' }: TweetProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  return (
    <div className={cn(
      "not-prose my-6 flex",
      alignmentClasses[align],
      className
    )}>
      <div className={cn(
        "max-w-xl w-full",
        // Theme integration with shadcn colors
        "[&_article]:bg-card [&_article]:border-border [&_article]:text-card-foreground",
        "[&_article]:shadow-sm [&_article]:rounded-lg",
        // Typography adjustments
        "[&_article]:font-sans",
        // Dark mode tweet styling
        "dark:[&_article]:bg-card dark:[&_article]:border-border",
        // Interactive elements
        "[&_article_a]:text-primary [&_article_a:hover]:text-primary/80",
        // Tweet text styling
        "[&_article_p]:text-foreground [&_article_p]:leading-relaxed",
        // Username and handle styling
        "[&_article_span]:text-muted-foreground",
        "[&_article_strong]:text-foreground [&_article_strong]:font-medium",
        // Timestamp styling
        "[&_article_time]:text-muted-foreground [&_article_time]:text-sm",
        // Action buttons
        "[&_article_button]:text-muted-foreground [&_article_button:hover]:text-foreground",
        // Images
        "[&_article_img]:rounded-md"
      )}>
        <RTweet id={id} />
      </div>
    </div>
  )
}
