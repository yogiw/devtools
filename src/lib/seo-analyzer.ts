import { createServerFn } from '@tanstack/react-start'

export interface MetaData {
  title: string
  description: string
  keywords: string
  author: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  ogType: string
  ogSiteName: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  canonical: string
  robots: string
  viewport: string
  charset: string
  language: string
  allMetaTags: Array<{ name: string; content: string }>
}

export const analyzeSeo = createServerFn({
  method: 'POST',
})
  .inputValidator((url: string) => {
    if (!url || typeof url !== 'string') {
      throw new Error('URL is required')
    }
    return url
  })
  .handler(async ({ data: url }) => {
    try {
      // Add protocol if missing
      let targetUrl = url.trim()
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`
      }

      // Fetch HTML from server (no CORS issues)
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }

      const html = await response.text()

      // Parse HTML using a simple regex-based parser (or use a library like jsdom)
      // For now, we'll use regex to extract meta tags
      const extractMeta = (name: string, attribute: string = 'name') => {
        const regex = new RegExp(
          `<meta[^>]*${attribute}=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*content=["']([^"']*)["']`,
          'i'
        )
        const match = html.match(regex)
        return match ? match[1] : ''
      }

      const extractProperty = (property: string) => {
        const regex = new RegExp(
          `<meta[^>]*property=["']${property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*content=["']([^"']*)["']`,
          'i'
        )
        const match = html.match(regex)
        return match ? match[1] : ''
      }

      const extractLink = (rel: string) => {
        const regex = new RegExp(
          `<link[^>]*rel=["']${rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*href=["']([^"']*)["']`,
          'i'
        )
        const match = html.match(regex)
        return match ? match[1] : ''
      }

      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
      const title = titleMatch ? titleMatch[1] : ''

      const charsetMatch = html.match(/<meta[^>]*charset=["']([^"']*)["']/i)
      const charset = charsetMatch ? charsetMatch[1] : ''

      const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i)
      const language = langMatch ? langMatch[1] : ''

      // Extract all meta tags
      const allMetaTags: Array<{ name: string; content: string }> = []
      const metaRegex = /<meta[^>]*>/gi
      let metaMatch
      while ((metaMatch = metaRegex.exec(html)) !== null) {
        const metaTag = metaMatch[0]
        const nameMatch = metaTag.match(/(?:name|property)=["']([^"']*)["']/i)
        const contentMatch = metaTag.match(/content=["']([^"']*)["']/i)
        if (nameMatch && contentMatch) {
          allMetaTags.push({
            name: nameMatch[1],
            content: contentMatch[1],
          })
        }
      }

      const data: MetaData = {
        title,
        description: extractMeta('description'),
        keywords: extractMeta('keywords'),
        author: extractMeta('author'),
        ogTitle: extractProperty('og:title'),
        ogDescription: extractProperty('og:description'),
        ogImage: extractProperty('og:image'),
        ogUrl: extractProperty('og:url'),
        ogType: extractProperty('og:type'),
        ogSiteName: extractProperty('og:site_name'),
        twitterCard: extractMeta('twitter:card'),
        twitterTitle: extractMeta('twitter:title'),
        twitterDescription: extractMeta('twitter:description'),
        twitterImage: extractMeta('twitter:image'),
        canonical: extractLink('canonical'),
        robots: extractMeta('robots'),
        viewport: extractMeta('viewport'),
        charset,
        language,
        allMetaTags,
      }

      return data
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch and parse URL'
      throw new Error(errorMessage)
    }
  })
