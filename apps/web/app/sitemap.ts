import type { MetadataRoute } from 'next'

const SITE = 'https://inkprint.com'

const routes = [
  '',
  '/product',
  '/for-teachers',
  '/for-institutions',
  '/pricing',
  '/research',
  '/about',
  '/blog',
  '/legal/privacy',
  '/legal/terms',
  '/legal/dpa',
] as const

// `/showcase` is intentionally absent — it's the internal design-system review
// surface and 404s in production.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return routes.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))
}
