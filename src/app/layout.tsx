// app/layout.tsx

import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import PageWrapper from '../components/PageWrapper'
import { Analytics } from '@vercel/analytics/next';
// highlight-start
import { getAllCategories } from '../lib/microcms'
import { buildCategoryTree } from '../lib/categoryUtils'
// highlight-end

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] })

// (Metadataの定義は省略)
// ...

export default async function RootLayout({ // async functionに変更
  children,
}: {
  children: React.ReactNode
}) {
  // highlight-start
  // ビルド時に全カテゴリーを取得し、ツリー構造に変換
  const allCategoriesData = await getAllCategories();
  const categoryTree = buildCategoryTree(allCategoriesData);
  // highlight-end

  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <div id="root">
          {/* PageWrapperにカテゴリーツリーのデータを渡す */}
          {/* highlight-next-line */}
          <PageWrapper categoryTree={categoryTree}>
            {children}
          </PageWrapper>
        </div>
        
        {/* JSON-LD構造化データ */}
        {/* ... */}
        <Analytics />
      </body>
    </html>
  )
}