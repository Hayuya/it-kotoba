/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.microcms-assets.io'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['microcms-js-sdk'],
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // ISR (Incremental Static Regeneration) 設定
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  // 最適化設定
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // TypeScript設定
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint設定
  eslint: {
    ignoreDuringBuilds: false,
  },
  // 出力設定
  output: 'standalone',
  // パワード by Next.js の削除
  poweredByHeader: false,
};

export default nextConfig;