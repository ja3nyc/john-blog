import { highlightCode } from '~/lib/syntax-highlight'

interface CodeWithLineNumbersProps {
  children?: React.ReactNode
  className?: string
}

export function CodeWithLineNumbers({ children, className = '' }: CodeWithLineNumbersProps) {
  // Handle cases where children might be undefined or not a string
  if (!children) {
    return <code className={className}></code>
  }
  
  // If it's already a pre-rendered code block (from rehype-highlight), just return it
  if (typeof children === 'object' && children && 'type' in children) {
    return <code className={className}>{children}</code>
  }
  
  // Extract language from className (e.g., "language-typescript")
  const language = className.replace('language-', '') || 'javascript'
  
  try {
    const highlightedLines = highlightCode(children, language)
    const maxLineNumber = highlightedLines.length
    const lineNumberWidth = maxLineNumber.toString().length

    return (
      <code className={`block ${className}`}>
        {highlightedLines.map((line, index) => (
          <div key={index} className="flex text-neutral-100">
            <span 
              className="text-neutral-500 select-none text-right bg-neutral-800/50 px-3 py-0.5 border-r border-neutral-700 sticky left-0 font-mono"
              style={{ width: `${lineNumberWidth + 2}ch` }}
            >
              {line.number}
            </span>
            <span 
              className="px-4 py-0.5 flex-1 min-w-0"
              dangerouslySetInnerHTML={{ __html: line.highlighted || line.content }}
            />
          </div>
        ))}
      </code>
    )
  } catch (error) {
    // Fallback to original content if highlighting fails
    console.warn('Code highlighting failed:', error)
    return <code className={className}>{children}</code>
  }
}