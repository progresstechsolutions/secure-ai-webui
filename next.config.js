/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Set default port for development
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
