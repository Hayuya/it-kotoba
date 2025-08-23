import Header from '../components/Header'
import IndexSidebar from '../components/IndexSidebar' // 変更：Sidebarから IndexSidebar に
import LatestArticles from '../components/LatestArticles'
import { getCategories, getStats } from '../lib/microcms'

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
              <h1 className="text-4xl font-bold mb-4">IT合言葉</h1>
              <p className="text-xl mb-6">
                情報処理安全確保支援士試験対策のための<br />
                IT用語解説サイト
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">⚪️ 最新シラバスに準拠</span>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">⚪️ 現実主義</span>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">⚪️ わかりやすさ重視</span>
                </div>
              </div>
            </section>

            {/* 新着記事セクション */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📰 新着記事</h2>
                <a 
                  href="/terms" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  すべての記事を見る →
                </a>
              </div>
              <LatestArticles />
            </section>

            {/* カテゴリー案内セクション */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">📚 学習カテゴリー</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 mb-6">
                  情報処理安全確保支援士試験の学習範囲を体系的に分類しています。
                  各カテゴリーから興味のある分野を選んで効率的に学習を進めましょう。
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.slice(0, 8).map((category) => (
                    <a
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-800 group-hover:text-blue-600 text-sm">
                          {category.name}
                        </h3>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <a 
                    href="/categories" 
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    すべてのカテゴリーを見る
                  </a>
                </div>
              </div>
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
                  <div className="text-3xl font-bold text-purple-600 mb-2">毎日更新</div>
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
                    基礎固めから始める
                  </h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• セキュリティの基本概念を理解</li>
                    <li>• 頻出用語から優先的に学習</li>
                    <li>• 実際の事例と関連付けて記憶</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🔄</span>
                    継続的な復習
                  </h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 定期的な見直しで定着させる</li>
                    <li>• 関連用語をセットで覚える</li>
                    <li>• 過去問題で実践力を向上</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <a 
                  href="/study-guide"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  詳しい学習ガイドを見る
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}