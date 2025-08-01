import { useState } from 'react'
import { cn } from '~/lib/utils'

interface ChartData {
  run: number
  value: number
}

interface PerfChartProps {
  metric: string
  before: ChartData[]
  after: ChartData[]
}

export function PerfChart({ metric, before, after }: PerfChartProps) {
  const [activeDataset, setActiveDataset] = useState<'before' | 'after' | 'both'>('both')
  
  const maxValue = Math.max(
    ...before.map(d => d.value),
    ...after.map(d => d.value)
  )
  
  const getHeight = (value: number) => (value / maxValue) * 200

  return (
    <div className="not-prose my-6">
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-foreground">{metric} Performance</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveDataset('before')}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors",
                activeDataset === 'before' 
                  ? 'bg-destructive text-destructive-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Before
            </button>
            <button
              onClick={() => setActiveDataset('after')}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors",
                activeDataset === 'after' 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              After
            </button>
            <button
              onClick={() => setActiveDataset('both')}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors",
                activeDataset === 'both' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Both
            </button>
          </div>
        </div>
        
        <div className="relative h-64 flex items-end space-x-1 bg-muted/30 rounded p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground pr-2">
            <span>{maxValue.toFixed(0)}</span>
            <span>{(maxValue * 0.75).toFixed(0)}</span>
            <span>{(maxValue * 0.5).toFixed(0)}</span>
            <span>{(maxValue * 0.25).toFixed(0)}</span>
            <span>0</span>
          </div>
          
          {/* Chart bars */}
          <div className="flex-1 flex items-end justify-center space-x-1 ml-8">
            {before.map((dataPoint, index) => (
              <div key={`before-${index}`} className="flex flex-col items-center space-y-1">
                {(activeDataset === 'before' || activeDataset === 'both') && (
                  <div
                    className="bg-destructive w-4 transition-all duration-300 hover:bg-destructive/80"
                    style={{ height: `${getHeight(dataPoint.value)}px` }}
                    title={`Before: ${dataPoint.value}`}
                  />
                )}
                {(activeDataset === 'after' || activeDataset === 'both') && (
                  <div
                    className="bg-success w-4 transition-all duration-300 hover:bg-success/80"
                    style={{ height: `${getHeight(after[index]?.value || 0)}px` }}
                    title={`After: ${after[index]?.value || 0}`}
                  />
                )}
                <span className="text-xs text-muted-foreground">{dataPoint.run}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          {(activeDataset === 'before' || activeDataset === 'both') && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded"></div>
              <span className="text-sm text-foreground">Before</span>
            </div>
          )}
          {(activeDataset === 'after' || activeDataset === 'both') && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-sm text-foreground">After</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
