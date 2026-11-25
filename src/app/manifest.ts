import type { MetadataRoute } from 'next'
import { basePath, SITE_TAGLINE } from '@/lib/site'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  const prefix = basePath()
  return {
    name: 'Hundredmark',
    short_name: 'Hundredmark',
    description: SITE_TAGLINE,
    start_url: `${prefix}/`,
    display: 'standalone',
    background_color: '#f3f0e8',
    theme_color: '#0f6e56',
    lang: 'en',
    icons: [{ src: `${prefix}/icon.svg`, sizes: 'any', type: 'image/svg+xml' }],
  }
}
