// Utility to get the site URL for absolute URLs in OpenGraph images
export function getSiteUrl(): string {
  // In production, use the environment variable or default domain
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: use environment variable or default
  return process.env.SITE_URL || process.env.VITE_SITE_URL || 'http://localhost:3000';
}

export function getAbsoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
