import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  basePath: '/blog',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default config
