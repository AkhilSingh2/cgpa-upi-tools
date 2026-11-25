import { ogContentType, ogSize, renderOg } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'CGPA to percentage calculator with cited university and board formulas'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg('CGPA to percentage calculator', 'CBSE, VTU, AKTU, Anna, Mumbai')
}
