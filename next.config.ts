import type { NextConfig } from 'next'

const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || ''
const basePath = rawBase && rawBase !== '/' ? rawBase.replace(/\/$/, '') : ''

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
  agentRules: false,
  transpilePackages: ['@sutra-ui/react', '@sutra-ui/tokens'],
  ...(basePath ? { basePath } : {}),
}

export default nextConfig
