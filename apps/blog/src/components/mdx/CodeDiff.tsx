import { getLanguageDisplayName, highlightCode } from '~/lib/syntax-highlight'
import { useState, useEffect, useRef } from 'react'

interface CodeDiffProps {
  before: string
  after: string
  language?: string
}

type DiffLine = {
  type: 'unchanged' | 'added' | 'removed'
  content: string
  beforeLineNumber?: number
  afterLineNumber?: number
}

function computeDiff(beforeLines: string[], afterLines: string[]): DiffLine[] {
  const diff: DiffLine[] = []
  let beforeIndex = 0
  let afterIndex = 0

  while (beforeIndex < beforeLines.length || afterIndex < afterLines.length) {
    const beforeLine = beforeLines[beforeIndex]
    const afterLine = afterLines[afterIndex]

    if (beforeIndex >= beforeLines.length) {
      diff.push({
        type: 'added',
        content: afterLine,
        afterLineNumber: afterIndex + 1
      })
      afterIndex++
    } else if (afterIndex >= afterLines.length) {
      diff.push({
        type: 'removed',
        content: beforeLine,
        beforeLineNumber: beforeIndex + 1
      })
      beforeIndex++
    } else if (beforeLine === afterLine) {
      diff.push({
        type: 'unchanged',
        content: beforeLine,
        beforeLineNumber: beforeIndex + 1,
        afterLineNumber: afterIndex + 1
      })
      beforeIndex++
      afterIndex++
    } else {
      // Look ahead for matches
      let foundMatch = false
      const lookahead = 3

      for (let i = 1; i <= lookahead && beforeIndex + i < beforeLines.length; i++) {
        if (beforeLines[beforeIndex + i] === afterLine) {
          for (let j = 0; j < i; j++) {
            diff.push({
              type: 'removed',
              content: beforeLines[beforeIndex + j],
              beforeLineNumber: beforeIndex + j + 1
            })
          }
          beforeIndex += i
          foundMatch = true
          break
        }
      }

      if (!foundMatch) {
        for (let i = 1; i <= lookahead && afterIndex + i < afterLines.length; i++) {
          if (afterLines[afterIndex + i] === beforeLine) {
            for (let j = 0; j < i; j++) {
              diff.push({
                type: 'added',
                content: afterLines[afterIndex + j],
                afterLineNumber: afterIndex + j + 1
              })
            }
            afterIndex += i
            foundMatch = true
            break
          }
        }
      }

      if (!foundMatch) {
        diff.push({
          type: 'removed',
          content: beforeLine,
          beforeLineNumber: beforeIndex + 1
        })
        diff.push({
          type: 'added',
          content: afterLine,
          afterLineNumber: afterIndex + 1
        })
        beforeIndex++
        afterIndex++
      }
    }
  }

  return diff
}

type AnimationStep = {
  type: 'remove' | 'add'
  line: DiffLine
  stepIndex: number
}

export function CodeDiff({ before, after, language = 'typescript' }: CodeDiffProps) {
  const [animationState, setAnimationState] = useState<'before' | 'animating' | 'after'>('before')
  const [currentStep, setCurrentStep] = useState(0)
  const animationRef = useRef<number | undefined>()
  const lastStepTime = useRef<number>(0)

  // Get highlighted code
  const beforeLines = highlightCode(before, language)
  const afterLines = highlightCode(after, language)
  const diffLines = computeDiff(before.split('\n'), after.split('\n'))

  // Create animation steps
  const animationSteps: AnimationStep[] = []
  diffLines.forEach((line) => {
    if (line.type === 'removed' || line.type === 'added') {
      animationSteps.push({
        type: line.type === 'removed' ? 'remove' : 'add',
        line,
        stepIndex: animationSteps.length
      })
    }
  })

  // Animation with consistent timing
  useEffect(() => {
    if (animationState !== 'animating') return

    const stepDuration = 200 // ms per step
    
    const animate = (timestamp: number) => {
      if (lastStepTime.current === 0) {
        lastStepTime.current = timestamp
      }

      const elapsed = timestamp - lastStepTime.current

      if (elapsed >= stepDuration) {
        setCurrentStep(prev => {
          const nextStep = prev + 1
          if (nextStep >= animationSteps.length) {
            setAnimationState('after')
            return 0
          }
          return nextStep
        })
        lastStepTime.current = timestamp
      }

      if (currentStep < animationSteps.length) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animationState, currentStep, animationSteps.length])

  const startAnimation = () => {
    setAnimationState('animating')
    setCurrentStep(0)
    lastStepTime.current = 0
  }

  const resetToStart = () => {
    setAnimationState('before')
    setCurrentStep(0)
    lastStepTime.current = 0
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const showFinalState = () => {
    setAnimationState('after')
    setCurrentStep(0)
    lastStepTime.current = 0
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  // Generate display lines based on current state
  const getDisplayLines = () => {
    if (animationState === 'before') {
      return beforeLines.map((line, i) => ({
        content: line.content,
        highlighted: line.highlighted,
        lineNumber: i + 1,
        status: 'normal' as const,
        uniqueKey: `before-${i}`
      }))
    }

    if (animationState === 'after') {
      return afterLines.map((line, i) => ({
        content: line.content,
        highlighted: line.highlighted,
        lineNumber: i + 1,
        status: 'normal' as const,
        uniqueKey: `after-${i}`
      }))
    }

    // Animation state - build lines step by step
    const lines: Array<{
      content: string
      highlighted: string
      lineNumber: number
      status: 'normal' | 'removing' | 'adding'
      uniqueKey: string
    }> = []

    let beforeLineNum = 1
    let afterLineNum = 1

    diffLines.forEach((diffLine) => {
      const stepIndex = animationSteps.findIndex(step => step.line === diffLine)
      const hasAnimated = stepIndex < currentStep && stepIndex >= 0

      if (diffLine.type === 'unchanged') {
        const beforeLine = beforeLines[beforeLineNum - 1]
        lines.push({
          content: beforeLine.content,
          highlighted: beforeLine.highlighted,
          lineNumber: beforeLineNum,
          status: 'normal',
          uniqueKey: `unchanged-${beforeLineNum}`
        })
        beforeLineNum++
        afterLineNum++
      } else if (diffLine.type === 'removed') {
        if (!hasAnimated) {
          const beforeLine = beforeLines[beforeLineNum - 1]
          lines.push({
            content: beforeLine.content,
            highlighted: beforeLine.highlighted,
            lineNumber: beforeLineNum,
            status: stepIndex === currentStep ? 'removing' : 'normal',
            uniqueKey: `remove-${beforeLineNum}`
          })
        }
        beforeLineNum++
      } else if (diffLine.type === 'added') {
        if (hasAnimated || stepIndex === currentStep) {
          const afterLine = afterLines[afterLineNum - 1]
          lines.push({
            content: afterLine.content,
            highlighted: afterLine.highlighted,
            lineNumber: afterLineNum,
            status: stepIndex === currentStep ? 'adding' : 'normal',
            uniqueKey: `add-${afterLineNum}`
          })
        }
        afterLineNum++
      }
    })

    return lines
  }

  const displayLines = getDisplayLines()
  const maxLines = Math.max(beforeLines.length, afterLines.length)
  const lineNumberWidth = Math.max(maxLines.toString().length, 2)

  return (
    <div className="not-prose my-6">
      <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
        {/* Header with controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Animated Code Diff</span>
            <span className="text-xs text-muted-foreground">{getLanguageDisplayName(language)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetToStart}
              className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={startAnimation}
              disabled={animationState === 'animating'}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {animationState === 'animating' ? 'Playing...' : '▶ Play'}
            </button>
            <button
              onClick={showFinalState}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Final
            </button>
          </div>
        </div>

        {/* Animated code display */}
        <div className="bg-neutral-900 overflow-x-auto max-h-96 overflow-y-auto">
          <pre className="text-sm">
            <code className="block">
              {displayLines.map((line) => (
                <div
                  key={line.uniqueKey}
                  className={`flex text-neutral-100 transition-all duration-200 ease-out ${
                    line.status === 'removing' ? 'bg-red-500/20 opacity-60 scale-y-90' :
                    line.status === 'adding' ? 'bg-green-500/20 scale-y-110' :
                    ''
                  }`}
                >
                  <span
                    className="text-neutral-500 select-none text-right bg-neutral-800/50 px-3 py-1 border-r border-neutral-700 font-mono sticky left-0 z-10"
                    style={{ width: `${lineNumberWidth + 2}ch` }}
                  >
                    {line.lineNumber}
                  </span>
                  <span
                    className="px-3 py-1 whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: line.highlighted }}
                  />
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* Progress indicator */}
        {animationState === 'animating' && animationSteps.length > 0 && (
          <div className="px-4 py-2 bg-muted/20 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {currentStep + 1} of {animationSteps.length}</span>
              <div className="w-32 bg-muted rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-200"
                  style={{ width: `${((currentStep + 1) / animationSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
