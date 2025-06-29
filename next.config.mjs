/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'skm.kr',
      },
      {
        protocol: 'https',
        hostname: '*.skm.kr',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
    domains: ['skm.kr', 'www.skm.kr'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: []
  }
}

export default nextConfig
