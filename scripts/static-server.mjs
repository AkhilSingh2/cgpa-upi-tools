import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('../e2e-dist/', import.meta.url))
const port = Number(process.env.PORT || 4173)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

async function readFromRoot(pathname) {
  const relative = pathname.replace(/^\/+/, '')
  const file = normalize(join(rootDir, relative))
  const rootWithSep = rootDir.endsWith('/') ? rootDir : `${rootDir}/`
  if (file !== rootDir && !file.startsWith(rootWithSep)) return null
  return readFile(file)
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    let pathname = decodeURIComponent(url.pathname)
    if (pathname.endsWith('/')) pathname += 'index.html'
    const data = await readFromRoot(pathname)
    if (!data) throw new Error('missing')
    const type = types[extname(pathname)] || 'application/octet-stream'
    res.writeHead(200, { 'content-type': type })
    res.end(data)
  } catch {
    try {
      const missing = await readFromRoot('/cgpa-upi-tools/404.html')
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
      res.end(missing)
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('not found')
    }
  }
})

server.listen(port, '127.0.0.1')
