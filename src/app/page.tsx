import Header from '../components/Header'
import IndexSidebar from '../components/IndexSidebar'
import LatestArticles from '../components/LatestArticles'
import { getCategories, getStats } from '../lib/microcms'
import HeroSearch from '../components/HeroSearch' // ★ HeroSearchコンポーネントをインポート

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
              <h1 className="text-4xl font-bold mb-4">IT言葉</h1>
              <p className="text-xl mb-6">
                豊富な情報量と記憶に残る解説<br />
                現代社会の情報処理技術用語索引サイト
              </p>
              {/* ▼▼▼ 変更箇所 ▼▼▼ */}
              <HeroSearch />
              {/* ▲▲▲ 変更箇所 ▲▲▲ */}
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
                    基礎固めから始める
                  </h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>ITの基本概念を理解</li>
                    <li>理解の曖昧さを放置しない</li>
                    <li>実際の事例と関連付ける</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🔄</span>
                    継続的な復習
                  </h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>定期的な見直しで定着させる</li>
                    <li>関連用語をセットで覚える</li>
                    <li>覚えた用語を実際に使ってみる</li>
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