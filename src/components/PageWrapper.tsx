// components/PageWrapper.tsx

'use client' // このファイルがクライアントコンポーネントであることを宣言

import Link from 'next/link'
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
      
      {/* Link Cards Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* おすすめ記事ページへのリンクカード */}
            <Link href="/recommended" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-8 group">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600">
                おすすめ記事
              </h3>
              <p className="text-gray-600 mb-4">
                IT言葉辞典が厳選した、特におすすめの用語をまとめてチェックできます。
              </p>
              <span className="font-semibold text-blue-600 group-hover:underline">
                一覧を見る →
              </span>
            </Link>

            {/* コマンド置き場ページへのリンクカード */}
            <Link href="/commands" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-8 group">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600">
                コマンド置き場
              </h3>
              <p className="text-gray-600 mb-4">
                よく使うコマンドや便利なコマンドの用語を集めました。逆引きにも便利です。
              </p>
              <span className="font-semibold text-green-600 group-hover:underline">
                一覧を見る →
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  )
}