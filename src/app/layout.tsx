// app/layout.tsx

import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import PageWrapper from '../components/PageWrapper'

const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IT合言葉 - 情報処理安全確保支援士試験対策＆IT用語学習',
  description: '情報処理安全確保支援士試験の対策を主軸に、全てのIT技術者のための用語解説・索引サイト。ネットワークやセキュリティなど、試験範囲を超えた実用的な知識もわかりやすく解説します。',
  keywords: '情報処理安全確保支援士, RISS, IT用語, 索引, セキュリティ, ネットワーク, データベース, 高度情報処理, 試験対策, 解説',
  authors: [{ name: 'IT合言葉編集部' }],
  openGraph: {
    title: 'IT合言葉 - 情報処理安全確保支援士試験対策＆IT用語学習',
    description: '試験対策から実務まで役立つ、IT専門用語の索引＆解説サイト',
    url: 'https://it-aikotoba.vercel.app',
    siteName: 'IT合言葉',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT合言葉 - 情報処理安全確保支援士試験対策＆IT用語学習',
    description: '試験対策から実務まで役立つ、IT専門用語の索引＆解説サイト',
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://it-aikotoba.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <div id="root">
          <PageWrapper>
            {children}
          </PageWrapper>
        </div>
        
        {/* JSON-LD構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "IT合言葉",
              "url": "https://it-aikotoba.vercel.app",
              "description": "情報処理安全確保支援士試験対策を中心に、IT専門用語を索引形式で解説する学習サイト",
              "publisher": {
                "@type": "Organization",
                "name": "IT合言葉編集部"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://it-aikotoba.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  )
}