// app/layout.tsx

import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import PageWrapper from '../components/PageWrapper'
import { Analytics } from '@vercel/analytics/next'; 


const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'IT言葉 | 情報処理安全確保支援士試験対策の用語集',
    template: '%s - IT言葉',
  },
  description: '情報処理安全確保支援士試験の合格を支援するIT用語解説サイト。ネットワーク、セキュリティから最新技術まで、頻出用語を体系的に学べます。図解や関連用語で理解を深め、効率的な試験対策を実現します。',
  keywords: '情報処理安全確保支援士, RISS, IT用語, 索引, セキュリティ, ネットワーク, データベース, 高度情報処理, 試験対策, 解説',
  authors: [{ name: 'IT言葉編集部' }],
  openGraph: {
    title: {
        default: 'IT言葉 | 情報処理安全確保支援士試験対策の用語集',
        template: '%s - IT言葉',
    },
    description: '試験対策から実務まで役立つ、IT専門用語の索引＆解説サイト',
    url: 'https://it-aikotoba.vercel.app',
    siteName: 'IT言葉',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: 'IT言葉 | 情報処理安全確保支援士試験対策の用語集',
        template: '%s - IT言葉',
    },
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
              "name": "IT言葉",
              "url": "https://it-aikotoba.vercel.app",
              "description": "情報処理安全確保支援士試験対策を中心に、IT専門用語を索引形式で解説する学習サイト",
              "publisher": {
                "@type": "Organization",
                "name": "IT言葉編集部"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://it-aikotoba.vercel.app/terms?q={search_term_string}",
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