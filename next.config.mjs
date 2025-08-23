/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像設定
  images: {
    domains: ['images.microcms-assets.io'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: false, // Vercelでの最適化を有効にする
  },

  // 実験的機能
  experimental: {
    optimizePackageImports: ['microcms-js-sdk'],
    optimizeCss: true,
    serverComponentsExternalPackages: ['microcms-js-sdk'],
  },

  // セキュリティヘッダー
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
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },

  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // その他の必要なリダイレクト
      {
        source: '/category/:slug',
        destination: '/categories/:slug',
        permanent: true,
      },
    ]
  },

  // リライト設定
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },

  // パフォーマンス最適化
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
    dirs: ['src'],
  },

  // 出力設定
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // パワード by Next.js の削除
  poweredByHeader: false,

  // 環境変数の公開設定
  env: {
    SITE_URL: process.env.SITE_URL || 'https://it-aikotoba.vercel.app',
  },

  // Webpack設定
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // microCMS SDK の最適化
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  // 本番環境での最適化
  ...(process.env.NODE_ENV === 'production' && {
    compress: true,
    generateEtags: true,
    httpAgentOptions: {
      keepAlive: true,
    },
  }),
}

export default nextConfig