import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import markdown from 'highlight.js/lib/languages/markdown'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('jsx', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('tsx', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', css)
hljs.registerLanguage('sass', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('mdx', markdown)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('rs', rust)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)

export interface HighlightedLine {
  content: string
  number: number
  highlighted: string
}

export function highlightCode(code: string | React.ReactNode, language: string): HighlightedLine[] {
  // Handle different input types
  let codeString: string
  
  if (typeof code === 'string') {
    codeString = code
  } else if (code && typeof code === 'object' && 'props' in code && code.props?.children) {
    // Handle React elements with children
    codeString = typeof code.props.children === 'string' ? code.props.children : String(code.props.children)
  } else {
    // Fallback to string conversion
    codeString = String(code || '')
  }
  
  const lines = codeString.split('\n')
  
  // Remove empty last line if it exists
  if (lines[lines.length - 1] === '') {
    lines.pop()
  }
  
  let highlightedCode: string
  
  try {
    if (hljs.getLanguage(language)) {
      highlightedCode = hljs.highlight(codeString, { language }).value
    } else {
      highlightedCode = hljs.highlightAuto(codeString).value
    }
  } catch (error) {
    // Fallback to plain text if highlighting fails
    highlightedCode = codeString
  }
  
  const highlightedLines = highlightedCode.split('\n')
  
  // Remove empty last line if it exists
  if (highlightedLines[highlightedLines.length - 1] === '') {
    highlightedLines.pop()
  }
  
  return lines.map((line, index) => ({
    content: line,
    number: index + 1,
    highlighted: highlightedLines[index] || line
  }))
}

export function getLanguageDisplayName(language: string): string {
  const languageMap: Record<string, string> = {
    js: 'JavaScript',
    jsx: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    tsx: 'TypeScript',
    typescript: 'TypeScript',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    json: 'JSON',
    html: 'HTML',
    xml: 'XML',
    md: 'Markdown',
    mdx: 'MDX',
    markdown: 'Markdown',
    bash: 'Bash',
    sh: 'Shell',
    shell: 'Shell',
    python: 'Python',
    py: 'Python',
    rust: 'Rust',
    rs: 'Rust',
    go: 'Go',
    java: 'Java'
  }
  
  return languageMap[language.toLowerCase()] || language.toUpperCase()
}