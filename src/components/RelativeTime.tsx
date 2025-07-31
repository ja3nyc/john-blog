import { useState, useEffect } from 'react'
import { formatDate, shouldUpdateRealtime } from '~/utils/date'

interface RelativeTimeProps {
  date: string
  className?: string
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const [formattedDate, setFormattedDate] = useState(() => formatDate(date))
  const [shouldUpdate, setShouldUpdate] = useState(() => shouldUpdateRealtime(date))

  useEffect(() => {
    if (!shouldUpdate) return

    const updateTime = () => {
      const newFormattedDate = formatDate(date)
      const newShouldUpdate = shouldUpdateRealtime(date)
      
      setFormattedDate(newFormattedDate)
      setShouldUpdate(newShouldUpdate)
    }

    // Update immediately
    updateTime()

    // Set up interval to update every second for recent posts
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [date, shouldUpdate])

  return <time className={className}>{formattedDate}</time>
}
