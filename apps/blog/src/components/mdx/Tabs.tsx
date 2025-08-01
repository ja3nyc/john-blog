import { Children, ReactElement, cloneElement, useState, useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'

interface TabProps {
  label: string
  children: React.ReactNode
}

export function Tab({ children }: TabProps) {
  const tabRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const addLineNumbers = () => {
      if (!tabRef.current) return
      
      const codeBlocks = tabRef.current.querySelectorAll('pre code')
      codeBlocks.forEach((codeBlock) => {
        if (codeBlock.querySelector('.line-numbers')) return // Already processed
        
        const lines = codeBlock.textContent?.split('\n') || []
        if (lines[lines.length - 1] === '') lines.pop() // Remove empty last line
        
        const lineNumbersDiv = document.createElement('div')
        lineNumbersDiv.className = 'line-numbers absolute left-0 top-0 w-12 h-full bg-muted/50 border-r border-border text-muted-foreground text-right text-sm font-mono select-none p-4 leading-relaxed'
        
        lineNumbersDiv.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('')
        
        const pre = codeBlock.parentElement
        if (pre) {
          pre.style.position = 'relative'
          pre.style.paddingLeft = '3.5rem'
          pre.appendChild(lineNumbersDiv)
        }
      })
    }

    addLineNumbers()
  }, [children])

  return (
    <div className="h-full" ref={tabRef}>
      <div className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_.hljs]:!rounded-none [&_pre]:!bg-transparent [&_pre]:text-sm [&_pre]:h-96 [&_pre]:overflow-auto">
        {children}
      </div>
    </div>
  )
}

interface TabsProps {
  children: ReactElement<TabProps>[]
  defaultTab?: number
}

export function Tabs({ children, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const tabs = Children.toArray(children) as ReactElement<TabProps>[]

  return (
    <div className="not-prose my-6">
      <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden font-mono">
        {/* Tab Headers - Code Editor Style */}
        <div className="flex border-b border-border bg-muted/50">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all duration-200 relative border-r border-border last:border-r-0",
                activeTab === index
                  ? 'text-card-foreground bg-background'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/80'
              )}
            >
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/60"></span>
                <span>{tab.props.label}</span>
              </span>
              {activeTab === index && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
          <div className="flex-1 bg-muted/30"></div>
        </div>

        {/* Tab Content - Scrollable Code Editor */}
        <div className="relative h-96 overflow-hidden bg-muted/20">
          <div className="absolute inset-0 overflow-auto">
            {tabs[activeTab] && cloneElement(tabs[activeTab])}
          </div>
        </div>
      </div>
    </div>
  )
}
