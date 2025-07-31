'use client'

import { useState } from 'react'

export function Counter({ initialValue = 0 }: { initialValue?: number }) {
  const [count, setCount] = useState(initialValue)

  return (
    <div className="not-prose my-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium text-neutral-100">
          Interactive Counter
        </div>
        <div className="text-sm text-neutral-400">
          React Component
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-md transition-colors"
        >
          -
        </button>
        
        <div className="text-2xl font-bold text-neutral-100 min-w-[3rem] text-center">
          {count}
        </div>
        
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-md transition-colors"
        >
          +
        </button>
      </div>
      
      <div className="mt-4 text-sm text-neutral-400">
        This is an interactive React component embedded in MDX. Try clicking the buttons!
      </div>
    </div>
  )
}
