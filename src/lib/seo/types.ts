export type SEOMetadata = {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  type?: 'article' | 'website'
}
