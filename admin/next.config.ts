import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // No static export - this is a dynamic server-rendered app
  // Tell Next.js this is the workspace root for this app
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig
