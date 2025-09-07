// components/PageWrapper.tsx

'use client' // このファイルがクライアントコンポーネントであることを宣言

import LatestArticles from './LatestArticles' // LatestArticlesをインポート
import Footer from './Footer'

// サーバーコンポーネントから渡される子要素(children)を受け取る
export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* ページ固有のコンテンツがここに表示される */}
      {children}
      
      {/* Latest Articles - フッター直上に配置 */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
        </div>
      </section>
      
      <Footer />
    </>
  )
}