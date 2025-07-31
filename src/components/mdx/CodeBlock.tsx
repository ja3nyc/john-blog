'use client'

import { useState } from 'react'

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
  showLineNumbers = false 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = children.split('\n')

  return (
    <div className="not-prose my-6 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
          <div className="text-sm font-medium text-neutral-200">{title}</div>
          <div className="text-xs text-neutral-400 uppercase">{language}</div>
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-neutral-100">
            {showLineNumbers ? (
              lines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-neutral-500 mr-4 select-none w-8 text-right">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              children
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}
