import type { MetadataRoute } from 'next'
import lightTokens from '@sutra-ui/tokens/tokens/light'
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
    background_color: lightTokens['color.bg.canvas'],
    theme_color: lightTokens['color.bg.primary'],
    lang: 'en',
    icons: [{ src: `${prefix}/icon.svg`, sizes: 'any', type: 'image/svg+xml' }],
  }
}
