import { useState } from 'react'
import { cn } from '~/lib/utils'

interface MetricData {
  metric: string
  before: number
  after: number
  improvement: string
  unit?: string
}

interface MetricTableProps {
  data: MetricData[]
}

export function MetricTable({ data }: MetricTableProps) {
  const [sortBy, setSortBy] = useState<keyof MetricData>('metric')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: keyof MetricData) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    
    if (sortOrder === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
    }
  })

  const getSortIcon = (column: keyof MetricData) => {
    if (sortBy !== column) return '↕️'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-card rounded-lg overflow-hidden border">
          <thead>
            <tr className="bg-muted/50">
              <th 
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium cursor-pointer transition-colors",
                  "hover:bg-muted text-foreground"
                )}
                onClick={() => handleSort('metric')}
              >
                Metric {getSortIcon('metric')}
              </th>
              <th 
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium cursor-pointer transition-colors",
                  "hover:bg-muted text-foreground"
                )}
                onClick={() => handleSort('before')}
              >
                Before {getSortIcon('before')}
              </th>
              <th 
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium cursor-pointer transition-colors",
                  "hover:bg-muted text-foreground"
                )}
                onClick={() => handleSort('after')}
              >
                After {getSortIcon('after')}
              </th>
              <th 
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium cursor-pointer transition-colors",
                  "hover:bg-muted text-foreground"
                )}
                onClick={() => handleSort('improvement')}
              >
                Improvement {getSortIcon('improvement')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr 
                key={index} 
                className={cn(
                  "border-t transition-colors",
                  "hover:bg-muted/50"
                )}
              >
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  {row.metric}
                </td>
                <td className="px-4 py-3 text-sm text-destructive">
                  {row.before}{row.unit && ` ${row.unit}`}
                </td>
                <td className="px-4 py-3 text-sm text-success">
                  {row.after}{row.unit && ` ${row.unit}`}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-primary">
                  {row.improvement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
