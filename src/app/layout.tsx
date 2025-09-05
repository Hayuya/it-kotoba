// app/layout.tsx

import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import PageWrapper from '../components/PageWrapper'
import { Analytics } from '@vercel/analytics/next';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] })

// サイトの基本情報を定義
const siteConfig = {
  url: 'https://it-aikotoba.vercel.app',
  title: 'IT言葉辞典 | あなたの学びを加速する、高速IT用語辞典',
  description: 'ITパスポートから高度試験まで、すべてのIT学習者を支える高速・高機能な用語辞典。参考書や動画学習と併用すれば理解が加速。日常で気になった用語も瞬時に解決。あなたの「知りたい」に応える、新しい学習のお供です。',
}

export const metadata: Metadata = {
  // URLのベースを設定
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s - IT言葉辞典`,
  },
  description: siteConfig.description,
  keywords: 'IT用語, 索引, 辞書, ITパスポート, 基本情報技術者, 応用情報技術者, 高度情報処理, 資格試験, 学習支援, プログラミング',
  authors: [{ name: 'IT言葉辞典編集部', url: siteConfig.url }],
  // Canonical URLを明示的に指定
  alternates: {
    canonical: '/',
  },
  // OGP設定
  openGraph: {
    title: {
        default: siteConfig.title,
        template: '%s - IT言葉辞典',
    },
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: 'IT言葉辞典',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/ogp.png', // OGP画像のパス
        width: 1200,
        height: 630,
        alt: 'IT言葉辞典 OGP画像',
      },
    ],
  },
  // Twitterカード設定
  twitter: {
    card: 'summary_large_image',
    title: {
        default: siteConfig.title,
        template: '%s - IT言葉辞典',
    },
    description: siteConfig.description,
    // creator: '@your_twitter_handle', // サイト運営者のTwitter ID
    images: [`${siteConfig.url}/ogp.png`], // OGP画像
  },
  // ロボット設定
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // アイコン設定
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  // マニフェストファイル
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <div id="root">
          <PageWrapper>
            {children}
          </PageWrapper>
        </div>
        
        {/* JSON-LD構造化データ (WebSite) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "IT言葉辞典",
              "url": siteConfig.url,
              "description": "IT資格学習や実務で役立つ、高速・高機能なIT用語解説サイト。",
              "publisher": {
                "@type": "Organization",
                "name": "IT言葉辞典編集部",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${siteConfig.url}/icon.png`, // サイトロゴのURL
                  "width": 60,
                  "height": 60
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${siteConfig.url}/terms?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}