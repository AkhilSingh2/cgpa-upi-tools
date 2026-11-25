import { afterEach, describe, expect, it } from 'vitest'
import { absoluteUrl } from '@/lib/site'
import { buildSharePath, parseShareSearch } from '@/lib/share'
import { publicRoutes } from '@/lib/routes'

const baseState = {
  preset: 'vtu',
  scheme: '2018',
  mode: 'cgpa' as const,
  cgpa: '8.2',
  pct: '',
  semesters: [],
  slope: '',
  intercept: '',
  scale: '10',
}

describe('shareable result URLs', () => {
  it('round-trips a VTU result onto the preset path', () => {
    const path = buildSharePath(baseState)
    expect(path.startsWith('/cgpa-to-percentage/vtu/?')).toBe(true)
    const parsed = parseShareSearch(path.split('?')[1])
    expect(parsed.scheme).toBe('2018')
    expect(parsed.mode).toBe('cgpa')
    expect(parsed.cgpa).toBe('8.2')
  })

  it('encodes semester rows and a custom formula', () => {
    const path = buildSharePath({
      ...baseState,
      preset: 'custom',
      scheme: '',
      mode: 'sgpa',
      slope: '9.5',
      intercept: '0',
      scale: '10',
      semesters: [
        { sgpa: '8.2', credits: '24' },
        { sgpa: '7.9', credits: '22' },
      ],
    })
    expect(path).toContain('preset=custom')
    expect(path).toContain('slope=9.5')
    expect(path).toContain('sem=8.2%3A24%2C7.9%3A22')
    const parsed = parseShareSearch(new URL(`https://example.com${path}`).search)
    expect(parsed.semesters).toEqual([
      { sgpa: '8.2', credits: '24' },
      { sgpa: '7.9', credits: '22' },
    ])
    expect(parsed.slope).toBe('9.5')
  })
})

describe('canonical URLs', () => {
  const previous = { ...process.env }

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = previous.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_BASE_PATH = previous.NEXT_PUBLIC_BASE_PATH
  })

  it('adds the project base path once and keeps a trailing slash', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.github.io'
    process.env.NEXT_PUBLIC_BASE_PATH = '/cgpa-upi-tools'
    expect(absoluteUrl('/cgpa-to-percentage/vtu')).toBe(
      'https://example.github.io/cgpa-upi-tools/cgpa-to-percentage/vtu/',
    )
    expect(absoluteUrl('/upi-qr-code-generator/?amount=1')).toBe(
      'https://example.github.io/cgpa-upi-tools/upi-qr-code-generator/?amount=1',
    )
  })
})

describe('public routes', () => {
  it('includes a page for every preset and both tools', () => {
    const paths = publicRoutes().map((route) => route.path)
    expect(paths).toContain('/cgpa-to-percentage/')
    expect(paths).toContain('/cgpa-to-percentage/vtu/')
    expect(paths).toContain('/cgpa-to-percentage/mumbai-university/')
    expect(paths).toContain('/upi-qr-code-generator/')
    expect(new Set(paths).size).toBe(paths.length)
  })
})
