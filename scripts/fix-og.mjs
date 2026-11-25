import { copyFileSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')

function withBase(url) {
  if (!base || !url.startsWith(`${origin}/`) || url.startsWith(`${origin}${base}/`)) return url
  return `${origin}${base}${url.slice(origin.length)}`
}

function rewriteHtml(html) {
  const renamed = html.replace(/opengraph-image\?[^"'\\\s>]+/g, 'opengraph-image.png')
  return renamed.replace(/((?:og:image|twitter:image)" content=")([^"]+)/g, (_, prefix, url) => `${prefix}${withBase(url)}`)
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      walk(path)
      continue
    }
    if (name === 'opengraph-image') {
      copyFileSync(path, `${path}.png`)
      continue
    }
    if (name.endsWith('.html')) {
      const html = readFileSync(path, 'utf8')
      const next = rewriteHtml(html)
      if (next !== html) writeFileSync(path, next)
    }
  }
}

walk('out')
