// components/PageWrapper.tsx

'use client' // このファイルがクライアントコンポーネントであることを宣言

import RecommendedSlider from './RecommendedSlider'
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
      
      {/* Recommended Slider - フッター直上に配置 */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">おすすめ記事</h2>
          <RecommendedSlider />
        </div>
      </section>
      
      <Footer />
    </>
  )
}