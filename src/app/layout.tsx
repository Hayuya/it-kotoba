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
  title: 'IT言葉 | 情報処理安全確保支援士試験対策の用語集',
  description: '情報処理安全確保支援士試験の合格を支援するIT用語解説サイト。ネットワーク、セキュリティから最新技術まで、頻出用語を体系的に学べます。図解や関連用語で理解を深め、効率的な試験対策を実現します。',
}

export const metadata: Metadata = {
  // URLのベースを設定
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s - IT言葉`,
  },
  description: siteConfig.description,
  keywords: '情報処理安全確保支援士, RISS, IT用語, 索引, セキュリティ, ネットワーク, データベース, 高度情報処理, 試験対策, 解説',
  authors: [{ name: 'IT言葉編集部', url: siteConfig.url }],
  // Canonical URLを明示的に指定
  alternates: {
    canonical: '/',
  },
  // OGP設定
  openGraph: {
    title: {
        default: siteConfig.title,
        template: '%s - IT言葉',
    },
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: 'IT言葉',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/ogp.png', // OGP画像のパス
        width: 1200,
        height: 630,
        alt: 'IT言葉 OGP画像',
      },
    ],
  },
  // Twitterカード設定
  twitter: {
    card: 'summary_large_image',
    title: {
        default: siteConfig.title,
        template: '%s - IT言葉',
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
    icon: '/favicon.ico',
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
              "name": "IT言葉",
              "url": siteConfig.url,
              "description": "情報処理安全確保支援士試験対策を中心に、IT専門用語を索引形式で解説する学習サイト",
              "publisher": {
                "@type": "Organization",
                "name": "IT言葉編集部",
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