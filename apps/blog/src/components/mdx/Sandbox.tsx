import { useEffect, useRef, useState } from 'react'

// StackBlitz SDK types
declare global {
  interface Window {
    StackBlitzSDK?: {
      embedGithubProject: (
        elementOrId: string | HTMLElement,
        githubProject: string,
        options?: {
          openFile?: string | string[]
          view?: 'editor' | 'preview' | 'both'
          theme?: 'dark' | 'light'
          hideNavigation?: boolean
          hideDevTools?: boolean
          forceEmbedLayout?: boolean
          clickToLoad?: boolean
        }
      ) => Promise<any>
      embedProject: (
        elementOrId: string | HTMLElement,
        project: any,
        options?: any
      ) => Promise<any>
    }
  }
}

interface SandboxProps {
  repo: string
  height?: number
  theme?: 'dark' | 'light'
  file?: string
  view?: 'editor' | 'preview' | 'split'
  provider?: 'stackblitz' | 'codesandbox' | 'auto'
}

export function Sandbox({
  repo,
  height = 500,
  theme = 'dark',
  file,
  view = 'preview',
  provider = 'stackblitz'
}: SandboxProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentProvider, setCurrentProvider] = useState(provider)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load StackBlitz SDK (client-side only)
  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === 'undefined') return

    const loadStackBlitzSDK = () => {
      if (window.StackBlitzSDK) {
        setSdkLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@stackblitz/sdk@1/bundles/sdk.umd.js'
      script.onload = () => {
        setSdkLoaded(true)
      }
      script.onerror = () => {
        console.warn('Failed to load StackBlitz SDK, falling back to iframe')
        setSdkLoaded(false)
      }
      document.head.appendChild(script)
    }

    if (currentProvider === 'stackblitz') {
      loadStackBlitzSDK()
    } else {
      setSdkLoaded(false)
    }
  }, [currentProvider])

  // Initialize sandbox when SDK is loaded (client-side only)
  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === 'undefined') return
    if (!sdkLoaded || !containerRef.current || currentProvider !== 'stackblitz') return

    const initStackBlitz = async () => {
      try {
        setIsLoading(true)
        setHasError(false)

        const options = {
          openFile: file ? (Array.isArray(file) ? file : [file]) : undefined,
          view: view === 'split' ? 'both' as const : view,
          theme: theme,
          hideNavigation: true,
          hideDevTools: view === 'preview',
          forceEmbedLayout: true,
          clickToLoad: false
        }

        await window.StackBlitzSDK?.embedGithubProject(
          containerRef.current!,
          repo,
          options
        )

        setIsLoading(false)
      } catch (error) {
        console.error('StackBlitz SDK error:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    // Clear container before initializing
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }

    initStackBlitz()
  }, [sdkLoaded, repo, file, view, theme])

  // Set up loading timeout
  useEffect(() => {
    if (isLoading && currentProvider === 'stackblitz') {
      timeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setHasError(true)
          setIsLoading(false)
        }
      }, 15000) // 15 second timeout
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, currentProvider])

  // Build sandbox URL based on provider (SSR-safe)
  const buildSandboxUrl = (providerType: string = currentProvider) => {
    switch (providerType) {
      case 'stackblitz':
        const stackBlitzParams = new URLSearchParams({
          embed: '1',
          file: file || 'src/App.tsx,src/App.jsx,src/main.tsx,src/main.jsx,src/index.tsx,src/index.jsx',
          hideNavigation: '1',
          hideDevTools: view === 'preview' ? '1' : '0',
          theme: theme,
          view: view === 'split' ? 'both' : view
        })
        // Only add origin on client-side
        if (typeof window !== 'undefined') {
          stackBlitzParams.set('origin', window.location.origin)
        }
        return `https://stackblitz.com/github/${repo}?${stackBlitzParams.toString()}`

      case 'codesandbox':
      default:
        const codeSandboxParams = new URLSearchParams({
          fontsize: '14',
          hidenavigation: '1',
          theme: theme,
          view: view,
          module: file || '/src/App.js',
          hidedevtools: view === 'preview' ? '1' : '0',
          codemirror: '1'
        })
        return `https://codesandbox.io/embed/github/${repo}?${codeSandboxParams.toString()}`
    }
  }


  const sandboxUrl = buildSandboxUrl()

  const handleIframeLoad = () => {
    if (currentProvider === 'codesandbox') {
      setIsLoading(false)
      setHasError(false)
    }
  }

  const handleIframeError = () => {
    setIsLoading(false)
    // Try fallback provider if current one fails
    if (currentProvider === 'stackblitz' && provider === 'auto') {
      setCurrentProvider('codesandbox')
      setHasError(false)
      setIsLoading(true)
    } else {
      setHasError(true)
    }
  }

  const refreshSandbox = () => {
    setIsLoading(true)
    setHasError(false)

    if (currentProvider === 'stackblitz' && containerRef.current) {
      // Clear and reinitialize SDK
      containerRef.current.innerHTML = ''
      // The useEffect will handle reinitialization
    }
  }

  const switchProvider = (newProvider: 'stackblitz' | 'codesandbox') => {
    setCurrentProvider(newProvider)
    setIsLoading(true)
    setHasError(false)

    if (newProvider === 'stackblitz' && containerRef.current) {
      containerRef.current.innerHTML = ''
    }
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="not-prose my-6">
        <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">⚡ Live Demo</span>
              <span className="text-xs text-muted-foreground">{repo}</span>
            </div>
          </div>
          <div className="relative" style={{ height: `${height}px` }}>
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full mb-3" />
                <p className="text-sm text-muted-foreground">Initializing...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="not-prose my-6">
      <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">⚡ Live Demo</span>
            <span className="text-xs text-muted-foreground">{repo}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">{currentProvider}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshSandbox}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh sandbox"
            >
              ↻ Refresh
            </button>
            {currentProvider === 'stackblitz' ? (
              <button
                onClick={() => switchProvider('codesandbox')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Try CodeSandbox"
              >
                Try CodeSandbox
              </button>
            ) : (
              <button
                onClick={() => switchProvider('stackblitz')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Try StackBlitz"
              >
                Try StackBlitz
              </button>
            )}
            <a
              href={`https://github.com/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              GitHub
            </a>
            <a
              href={buildSandboxUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Open {currentProvider === 'stackblitz' ? 'StackBlitz' : 'CodeSandbox'}
            </a>
          </div>
        </div>

        <div className="relative" style={{ height: `${height}px` }}>
          {currentProvider === 'stackblitz' ? (
            // StackBlitz SDK container
            <div
              ref={containerRef}
              className="w-full h-full"
              style={{ minHeight: `${height}px` }}
            />
          ) : (
            // CodeSandbox iframe fallback
            <iframe
              src={sandboxUrl}
              className="w-full h-full border-0"
              title={`${currentProvider} demo for ${repo}`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
              referrerPolicy="no-referrer-when-downgrade"
              loading="lazy"
            />
          )}

          {/* Loading overlay */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full mb-3" />
                <p className="text-sm text-muted-foreground">Loading sandbox...</p>
              </div>
            </div>
          )}

          {/* Error state with browser-specific messaging */}
          {hasError && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center max-w-lg p-6">
                <div className="text-4xl mb-3">🔗</div>
                <h3 className="text-lg font-medium text-foreground mb-2">Sandbox Preview Unavailable</h3>

                {/* Provider-specific messaging */}
                {currentProvider === 'stackblitz' ? (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-3">
                      The StackBlitz embed couldn't be loaded. This might be due to network issues, browser restrictions, or the repository configuration.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 Try switching to CodeSandbox or access the demo directly via the links below.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-6">
                    Due to browser security restrictions, the live preview cannot be embedded. You can still access the full interactive demo through the links below.
                  </p>
                )}

                {/* Preview card */}
                <div className="bg-muted/50 rounded-lg p-4 mb-6 border-2 border-dashed border-border">
                  <div className="flex items-center justify-center h-32 bg-background/50 rounded mb-3">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-sm text-muted-foreground">Interactive Demo Available</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Repository: {repo}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentProvider === 'stackblitz' ? (
                    <button
                      onClick={() => switchProvider('codesandbox')}
                      className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Try CodeSandbox
                    </button>
                  ) : (
                    <button
                      onClick={refreshSandbox}
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      ↻ Retry
                    </button>
                  )}
                  <a
                    href={buildSandboxUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center inline-block"
                  >
                    Open {currentProvider === 'stackblitz' ? 'StackBlitz' : 'CodeSandbox'}
                  </a>
                  <a
                    href={`https://github.com/${repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-center inline-block"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
