import { PRESETS, getPreset } from '@/data/presets'
import { ogContentType, ogSize, renderOg } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'CGPA to percentage calculator'
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return PRESETS.map((preset) => ({ slug: preset.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const preset = getPreset(slug)
  return renderOg(preset?.h1 ?? 'CGPA to percentage', preset?.shortName ?? 'Hundredmark')
}
