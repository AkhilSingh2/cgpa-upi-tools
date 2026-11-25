import type { MetadataRoute } from 'next'
import { publicRoutes } from '@/lib/routes'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-11-25')
  return publicRoutes().map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
