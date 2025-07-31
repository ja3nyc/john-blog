/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { ThemeSwitcher } from '~/components/ThemeSwitcher'
import { ThemeProvider } from '~/components/ThemeProvider'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'John Annunziato | Full-Stack Developer',
        description: 'Personal blog and portfolio of John Annunziato, a full-stack developer sharing insights on web development, technology, and programming.',
      }),
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        src: '/customScript.js',
        type: 'text/javascript',
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
            <nav className="max-w-3xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="text-lg font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  John Annunziato
                </Link>
                <div className="flex items-center space-x-6 text-sm">
                  <Link
                    to="/"
                    activeProps={{
                      className: 'text-foreground border-b border-border',
                    }}
                    activeOptions={{ exact: true }}
                    className="text-muted-foreground hover:text-foreground transition-colors pb-1"
                  >
                    Home
                  </Link>
                  <Link
                    to="/blog"
                    activeProps={{
                      className: 'text-foreground border-b border-border',
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors pb-1"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/about"
                    activeProps={{
                      className: 'text-foreground border-b border-border',
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors pb-1"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/contact"
                    activeProps={{
                      className: 'text-foreground border-b border-border',
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors pb-1"
                  >
                    Contact
                  </Link>
                <ThemeSwitcher />
              </div>
            </div>
          </nav>
          </header>
          <main className="max-w-3xl mx-auto px-6 py-12 min-h-screen">
            {children}
          </main>
          <footer className="border-t border-border mt-24">
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  John Annunziato - 2025
                </p>
                <div className="flex items-center space-x-6">
                  <a
                    href="https://github.com/johnannunziato"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-100 transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/johnannunziato"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-100 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://twitter.com/johnannunziato"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-100 transition-colors"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
