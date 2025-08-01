export function calculateReadingTime(content: string): string {
  // Remove HTML tags and MDX components for accurate word count
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Replace links with just text
    .replace(/[#*_~]/g, '') // Remove markdown formatting
    .trim()

  const words = cleanContent.split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // Average reading speed is 200-250 words per minute
  // Using 225 as a middle ground
  const readingTimeMinutes = Math.ceil(wordCount / 225)
  
  if (readingTimeMinutes === 1) {
    return '1 min read'
  }
  
  return `${readingTimeMinutes} min read`
}
