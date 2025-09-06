// components/PageWrapper.tsx

'use client'

import RecommendedSlider from './RecommendedSlider'
import Footer from './Footer'
// highlight-start
import CategoryTree from './CategoryTree' // 新しいCategoryTreeをインポート
import type { CategoryTreeNode } from '../lib/categoryUtils'

interface PageWrapperProps {
  children: React.ReactNode;
  categoryTree: CategoryTreeNode[]; // propsとして受け取る
}
// highlight-end


export default function PageWrapper({
  children,
  categoryTree, // propsを展開
}: PageWrapperProps) {
  return (
    <>
      {children}
      
      {/* ▼▼▼ ここから変更 ▼▼▼ */}
      {/* カテゴリーツリー - フッター直上に配置 */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <CategoryTree categoryTree={categoryTree} />
        </div>
      </section>

      {/* Recommended Slider - フッター直上に配置 */}
      <section className="bg-gray-50 py-12">
      {/* ▲▲▲ ここまで変更 ▲▲▲ */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">おすすめ記事</h2>
          <RecommendedSlider />
        </div>
      </section>
      
      <Footer />
    </>
  )
}