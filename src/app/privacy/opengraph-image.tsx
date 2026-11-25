import { ogContentType, ogSize, renderOg } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Hundredmark privacy: calculations and QR codes stay in the browser'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg('Privacy', 'Nothing to upload')
}
