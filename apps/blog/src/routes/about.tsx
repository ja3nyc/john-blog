import { createFileRoute } from '@tanstack/react-router'
import { seo } from '~/utils/seo'
import { getAbsoluteUrl } from '~/utils/url'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => {
    const ogImageUrl = getAbsoluteUrl('/api/og/about');
    
    return {
      meta: [
        ...seo({
          title: 'Projects - John Annunziato',
          description: 'Some things I\'ve built - projects and work by John Annunziato.',
          image: ogImageUrl,
        }),
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Projects - John Annunziato' },
      ],
    };
  },
})

function About() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-medium text-foreground">
          Projects
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Some things I've built.
        </p>
      </div>

      {/* Projects */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-foreground">
                Linear AI Upload
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered file upload tool for Linear
              </p>
            </div>
            <a
              href="https://github.com/ja3nyc/linear-ai-upload"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors ml-4"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
              TypeScript
            </span>
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
              Node.js
            </span>
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
              AI/ML
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  Caltho
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Trade journaling portfolio tracker
                </p>
              </div>
              <a
                href="https://caltho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                TanStack Start
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                React
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                TypeScript
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                PostgreSQL
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  OpenPreview
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Collaborative commenting toolbar for websites
                </p>
              </div>
              <a
                href="https://github.com/OpenPreview/OpenPreview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors ml-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                Next.js
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                JavaScript
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                Express
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                PostgreSQL
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
