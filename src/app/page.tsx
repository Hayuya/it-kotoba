import Header from '../components/Header'
import IndexSidebar from '../components/IndexSidebar'
import LatestArticles from '../components/LatestArticles'
import { getCategories, getStats } from '../lib/microcms'
import HeroSearch from '../components/HeroSearch'

export default async function Home() {
  // microCMSからデータを取得
  const [categories, stats] = await Promise.all([
    getCategories(),
    getStats()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー */}
          <aside className="lg:w-1/4">
            <IndexSidebar categories={categories} />
          </aside>

          {/* メインコンテンツ */}
          <main className="lg:w-3/4">
            {/* ヒーローセクション */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
              <h1 className="text-4xl font-bold mb-4">IT言葉辞典</h1>
              <p className="text-xl mb-6">
                参考書の横に、学びのそばに。<br />
                IT学習の「分からない」を瞬時に解決する高速用語辞典。
              </p>
              <HeroSearch />
            </section>

            {/* 新着記事セクション */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">新着</h2>
                <a 
                  href="/terms" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  すべての用語を見る →
                </a>
              </div>
              <LatestArticles />
            </section>

            {/* 統計情報 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">📊 サイト統計</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.totalTerms}+
                  </div>
                  <div className="text-gray-600">登録用語数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.totalCategories}
                  </div>
                  <div className="text-gray-600">カテゴリー数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">週３くらい</div>
                  <div className="text-gray-600">更新頻度</div>
                </div>
              </div>
            </section>

            {/* 学習のヒント */}
            <section className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 効率的な学習のコツ</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🎯</span>
                    辞書として活用する
                  </h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>学習中の不明点を即座に解決</li>
                    <li>知識の穴をなくし、理解を深める</li>
                    <li>書籍や動画と併用して学習効果アップ</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🔄</span>
                    関連知識を繋げる
                  </h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>関連用語を辿って知識を広げる</li>
                    <li>カテゴリやタグで体系的に学ぶ</li>
                    <li>全体像を掴み、記憶に定着させる</li>
                  </ul>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}