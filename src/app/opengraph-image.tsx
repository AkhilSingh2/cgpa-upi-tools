import { ogContentType, ogSize, renderOg } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Hundredmark: CGPA to percentage calculator and free UPI QR code generator'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg('Convert a CGPA, or print a UPI QR code', 'No ads. No account.')
}
