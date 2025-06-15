/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // API 라우트 바디 크기 제한 증가
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  // 실험적 기능으로 더 큰 요청 허용
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
