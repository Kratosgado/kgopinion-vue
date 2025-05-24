import { writeFileSync } from 'fs'

type SitemapUrl = {
  url: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  lastmod?: string
  news?: {
    publication: {
      name: string
      language: string
    }
    publication_date: string
    title: string
  }
  img?: Array<{
    url: string
    title?: string
    caption?: string
  }>
}

class SitemapGenerator {
  private hostname: string
  private urls: SitemapUrl[] = []

  constructor(hostname: string) {
    this.hostname = hostname
  }

  addUrl(url: SitemapUrl): void {
    this.urls.push(url)
  }

  addUrls(urls: SitemapUrl[]): void {
    this.urls.push(...urls)
  }
  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;'
        case '>':
          return '&gt;'
        case '&':
          return '&amp;'
        case "'":
          return '&apos;'
        case '"':
          return '&quot;'
        default:
          return c
      }
    })
  }

  private generateXML(): string {
    const urlElements = this.urls
      .map((map) => {
        let urlXml = ` <url>
      <loc>${this.hostname}${map.url}</loc>
      <lastmod>${map.lastmod || new Date().toISOString()}</lastmod>
      <changefreq>${map.changefreq}</changefreq>
      <priority>${map.priority}</priority>`

        if (map.img && map.img.length > 0) {
          map.img.forEach((image) => {
            urlXml += `
<image:image>
<image:loc>${image.url}</image:loc>`
            if (image.title) {
              urlXml += `
        <image:title>${this.escapeXml(image.title)}</image:title>`
            }
            if (image.caption) {
              urlXml += `
        <image:caption>${this.escapeXml(image.caption)}</image:caption>`
            }
            urlXml += `
</image:image>`
          })
        }
        if (map.news) {
          urlXml += `
      <news:news>
        <news:publication>
          <news:name>${this.escapeXml(map.news.publication.name)}</news:name>
          <news:language>${map.news.publication.language}</news:language>
        </news:publication>
        <news:publication_date>${map.news.publication_date}</news:publication_date>
        <news:title>${this.escapeXml(map.news.title)}</news:title>
      </news:news>`
        }
        urlXml += `
</url> `
        return urlXml
      })
      .join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
${urlElements}
</urlset>`
  }

  save(outputPath: string): void {
    const xml = this.generateXML()
    writeFileSync(outputPath, xml, 'utf-8')
    console.log(`✅ Sitemap generated successfully at ${outputPath}`)
  }
}
