export const SITE_NAME = 'Hundredmark'
export const SITE_TAGLINE = 'CGPA conversions with the formula on the page, and a UPI QR code that never leaves your browser.'

export function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export function basePath(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || ''
  if (!raw || raw === '/') return ''
  return (raw.startsWith('/') ? raw : `/${raw}`).replace(/\/$/, '')
}

export function withBasePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${basePath()}${normalized}`
}

/** Absolute URL including the GitHub Pages project path, with a trailing slash before any query. */
export function absoluteUrl(path: string): string {
  const [pathname, query] = path.split('?')
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const slashed = normalized.endsWith('/') ? normalized : `${normalized}/`
  const url = `${siteOrigin()}${basePath()}${slashed}`
  return query ? `${url}?${query}` : url
}
