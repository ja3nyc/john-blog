// Import all components first
import { Callout } from './Callout'
import { CodeBlock } from './CodeBlock'
import { Counter } from './Counter'
import { Tweet } from './Tweet'
import { CodeDiff } from './CodeDiff'
import { MetricTable } from './MetricTable'
import { PerfChart } from './PerfChart'
import { FileTree } from './FileTree'
import { Tabs, Tab } from './Tabs'
import { Sandbox } from './Sandbox'

// Export all MDX components
export { Callout } from './Callout'
export { CodeBlock } from './CodeBlock'
export { Counter } from './Counter'
export { Tweet } from './Tweet'
export { CodeDiff } from './CodeDiff'
export { MetricTable } from './MetricTable'
export { PerfChart } from './PerfChart'
export { FileTree } from './FileTree'
export { Tabs, Tab } from './Tabs'
export { Sandbox } from './Sandbox'

// MDX Components mapping for automatic component resolution
export const mdxComponents = {
  Callout,
  CodeBlock,
  Counter,
  Tweet,
  CodeDiff,
  MetricTable,
  PerfChart,
  FileTree,
  Tabs,
  Tab,
  Sandbox,
  // Let rehype-highlight handle the code highlighting normally
}
