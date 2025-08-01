import { useState } from 'react'
import { highlightCode, getLanguageDisplayName } from '~/lib/syntax-highlight'

interface CodeBlockProps {
  children: string
  language?: string
  title?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  children, 
  language = 'javascript', 
  title,
  showLineNumbers = true 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlightedLines = highlightCode(children, language)
  const maxLineNumber = highlightedLines.length
  const lineNumberWidth = maxLineNumber.toString().length

  return (
    <div className="not-prose my-6 bg-card border rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
        <div className="flex items-center space-x-2">
          {title && <span className="text-sm font-medium text-foreground">{title}</span>}
          <span className="text-xs text-muted-foreground">{getLanguageDisplayName(language)}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <div className="relative">
        <pre className="overflow-x-auto text-sm bg-neutral-900">
          <code className="block">
            {highlightedLines.map((line, index) => (
              <div key={index} className="flex text-neutral-100">
                {showLineNumbers && (
                  <span 
                    className="text-neutral-500 mr-4 select-none text-right bg-neutral-800/50 px-3 py-0.5 border-r border-neutral-700 sticky left-0 font-mono"
                    style={{ width: `${lineNumberWidth + 2}ch` }}
                  >
                    {line.number}
                  </span>
                )}
                <span 
                  className="px-4 py-0.5 flex-1 min-w-0"
                  dangerouslySetInnerHTML={{ __html: line.highlighted || line.content }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
