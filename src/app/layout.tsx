// app/layout.tsx

import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import PageWrapper from '../components/PageWrapper' // ★ 新規作成した PageWrapper をインポート

const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IT合言葉 - 情報処理安全確保支援士試験対策',
  description: '情報処理安全確保支援士試験対策のためのIT用語解説サイト。試験範囲を完全網羅した分かりやすい解説で合格をサポートします。',
  // ... その他のメタデータは変更なし
  keywords: '情報処理安全確保支援士,RISS,IT用語,セキュリティ,試験対策',
  authors: [{ name: 'IT合言葉編集部' }],
  openGraph: {
    title: 'IT合言葉 - 情報処理安全確保支援士試験対策',
    description: '情報処理安全確保支援士試験対策のためのIT用語解説サイト',
    url: 'https://it-aikotoba.vercel.app',
    siteName: 'IT合言葉',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT合言葉 - 情報処理安全確保支援士試験対策',
    description: '情報処理安全確保支援士試験対策のためのIT用語解説サイト',
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
        {/* ★ この行を削除しました <link rel="icon" href="/favicon.ico" /> */}
        <link rel="canonical" href="https://it-aikotoba.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <div id="root">
          {/* ★ ここで PageWrapper を使い、子要素を渡す */}
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
              "description": "情報処理安全確保支援士試験対策のためのIT用語解説サイト",
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