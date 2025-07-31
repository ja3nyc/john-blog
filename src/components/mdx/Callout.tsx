interface CalloutProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
}

export function Callout({ children, type = 'info', title }: CalloutProps) {
  const styles = {
    info: {
      container: 'bg-blue-950/50 border-blue-800/50 text-blue-100',
      icon: '💡',
      title: title || 'Info'
    },
    warning: {
      container: 'bg-yellow-950/50 border-yellow-800/50 text-yellow-100',
      icon: '⚠️',
      title: title || 'Warning'
    },
    error: {
      container: 'bg-red-950/50 border-red-800/50 text-red-100',
      icon: '❌',
      title: title || 'Error'
    },
    success: {
      container: 'bg-green-950/50 border-green-800/50 text-green-100',
      icon: '✅',
      title: title || 'Success'
    }
  }

  const style = styles[type]

  return (
    <div className={`not-prose my-6 p-4 border rounded-lg ${style.container}`}>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">{style.icon}</span>
        <span className="font-medium">{style.title}</span>
      </div>
      <div className="text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}
