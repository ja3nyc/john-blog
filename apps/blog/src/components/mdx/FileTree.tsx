import { cn } from '~/lib/utils'
import { useState } from 'react'

interface FileNode {
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  status?: 'added' | 'modified' | 'deleted'
}

interface FileTreeProps {
  root: FileNode
}

function TreeNode({ 
  node, 
  depth = 0, 
  isLast = false, 
  prefix = '' 
}: { 
  node: FileNode
  depth?: number
  isLast?: boolean
  prefix?: string
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'added': return 'text-green-500'
      case 'modified': return 'text-yellow-500'
      case 'deleted': return 'text-red-500 line-through opacity-70'
      default: return 'text-foreground'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'added': return '+'
      case 'modified': return '~'
      case 'deleted': return '-'
      default: return ''
    }
  }

  const getFileIcon = (name: string, type: string) => {
    if (type === 'directory') {
      return isExpanded ? '▼' : '▶'
    }
    
    const ext = name.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js':
      case 'jsx':
        return '◆'
      case 'ts':
      case 'tsx':
        return '◆'
      case 'json':
        return '◦'
      case 'md':
      case 'mdx':
        return '◦'
      case 'css':
      case 'scss':
      case 'sass':
        return '◦'
      case 'html':
        return '◦'
      case 'py':
        return '◦'
      case 'rs':
        return '◦'
      case 'go':
        return '◦'
      case 'java':
        return '◦'
      case 'php':
        return '◦'
      case 'rb':
        return '◦'
      case 'vue':
        return '◦'
      case 'svelte':
        return '◦'
      case 'yml':
      case 'yaml':
        return '◦'
      case 'toml':
        return '◦'
      case 'lock':
        return '◦'
      case 'env':
        return '◦'
      case 'gitignore':
        return '◦'
      case 'dockerfile':
        return '◦'
      default:
        return '◦'
    }
  }

  const currentPrefix = depth === 0 ? '' : prefix + (isLast ? '└── ' : '├── ')
  const nextPrefix = depth === 0 ? '' : prefix + (isLast ? '    ' : '│   ')

  const handleToggle = () => {
    if (node.type === 'directory' && node.children) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-0.5 hover:bg-muted/50 rounded-sm cursor-pointer transition-colors",
          getStatusColor(node.status)
        )}
        onClick={handleToggle}
        role="treeitem"
        aria-expanded={node.type === 'directory' ? isExpanded : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
      >
        <span className="text-muted-foreground font-mono text-sm select-none min-w-0">
          {currentPrefix}
        </span>
        <span className="text-sm mr-1.5 flex-shrink-0">
          {getFileIcon(node.name, node.type)}
        </span>
        <span className="text-sm font-mono truncate">
          {node.name}
        </span>
        {node.status && (
          <span className="text-xs bg-muted px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
            {getStatusIcon(node.status)}
          </span>
        )}
      </div>
      {node.children && isExpanded && (
        <div role="group">
          {node.children.map((child, index) => (
            <TreeNode 
              key={`${child.name}-${index}`} 
              node={child} 
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
              prefix={nextPrefix}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({ root }: FileTreeProps) {
  return (
    <div className="not-prose my-6" role="tree" aria-label="File structure">
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">File Structure</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Click directories to expand/collapse
          </div>
        </div>
        <div className="p-4 font-mono text-sm max-h-96 overflow-auto">
          <TreeNode node={root} />
        </div>
        <div className="flex flex-wrap gap-4 px-4 py-3 bg-muted/30 border-t text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-green-500 font-medium">+</span>
            <span className="text-muted-foreground">Added</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-yellow-500 font-medium">~</span>
            <span className="text-muted-foreground">Modified</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-red-500 font-medium">-</span>
            <span className="text-muted-foreground">Deleted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
