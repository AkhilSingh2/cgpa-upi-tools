import { ogContentType, ogSize, renderOg } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Free UPI QR code generator that runs in the browser'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg('Free UPI QR code generator', 'Built on your device. Not NPCI.')
}
