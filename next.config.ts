import type { NextConfig } from 'next'

const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || ''
const basePath = rawBase && rawBase !== '/' ? rawBase.replace(/\/$/, '') : ''

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
}

export default nextConfig
