import { PRESETS } from '@/data/presets'

export interface RouteEntry {
  path: string
  priority: number
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
}

export function publicRoutes(): RouteEntry[] {
  return [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/cgpa-to-percentage/', priority: 0.9, changeFrequency: 'weekly' },
    ...PRESETS.map((preset) => ({
      path: `/cgpa-to-percentage/${preset.slug}/`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    })),
    { path: '/upi-qr-code-generator/', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/privacy/', priority: 0.3, changeFrequency: 'yearly' },
  ]
}
