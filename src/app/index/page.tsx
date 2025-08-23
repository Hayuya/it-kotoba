import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import { getCategories } from '../../lib/microcms'

export const metadata: Metadata = {
  title: '用語索引 - IT合言葉',
  description: 'アルファベット順・数字順でIT用語を検索できます。効率的に目的の用語を見つけられます。',
  openGraph: {
    title: '用語索引 - IT合言葉',
    description: 'アルファベット順・数字順でIT用語を検索',
  }
}

// 簡略化された統計情報（静的データ）
function getStaticIndexStats() {
  const alphabetStats = new Map<string, number>()
  
  // アルファベットの初期化（実際の統計は動的に取得）
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
    alphabetStats.set(letter, 0) // 0で初期化、実際のデータは後でJavaScriptで更新
  })

  return {
    alphabet: alphabetStats,
    number: 0,
    total: 0
  }
}

export default async function IndexPage() {
  const [categories] = await Promise.all([
    getCategories()
  ])

  // 静的な統計情報を使用
  const stats = getStaticIndexStats()

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
            {/* パンくずリスト */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-blue-600">
                    ホーム
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-800 font-medium">用語索引</li>
              </ol>
            </nav>

            {/* ヘッダーセクション */}
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">📚 用語索引</h1>
              <p className="text-gray-600 mb-6">
                IT用語をアルファベット順・数字順で分類しています。<br />
                左のサイドバーから索引を選択するか、下記の一覧から直接選択してください。
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  📊 用語索引をご利用ください。サイドバーから文字を選択すると該当する用語が表示されます。
                </p>
              </div>
            </header>

            {/* アルファベット索引 */}
            <section className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔤 アルファベット索引</h2>
              <div className="grid grid-cols-6 md:grid-cols-13 gap-2">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char) => (
                  <div key={char} className="text-center">
                    <div className="bg-green-50 hover:bg-green-100 rounded-lg p-3 transition-colors group cursor-pointer">
                      <div className="text-lg font-bold text-green-600 group-hover:text-green-800 mb-1">
                        {char}
                      </div>
                      <div className="text-xs text-gray-600">
                        索引あり
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                ※ 各アルファベットはサイドバーの索引からご利用ください。
              </p>
            </section>

            {/* 数字索引 */}
            <section className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔢 数字索引</h2>
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 transition-colors group cursor-pointer">
                    <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-800 mb-2">
                      0-9
                    </div>
                    <div className="text-sm text-gray-600">
                      索引あり
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                ※ 数字で始まる用語（例：3DES、802.11など）はサイドバーの索引からご利用ください。
              </p>
            </section>

            {/* 使い方ガイド */}
            <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-800 mb-4">💡 索引の使い方</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">🎯 効率的な検索方法</h3>
                  <ul className="text-orange-700 space-y-2 text-sm">
                    <li>• <strong>サイドバー索引</strong>：アルファベットや数字を選択</li>
                    <li>• <strong>リアルタイム表示</strong>：該当する用語が即座に表示</li>
                    <li>• <strong>直接アクセス</strong>：用語名をクリックして詳細ページへ</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">📝 学習のコツ</h3>
                  <ul className="text-orange-700 space-y-2 text-sm">
                    <li>• 関連する用語をまとめて覚える</li>
                    <li>• 略語は正式名称と一緒に覚える</li>
                    <li>• 定期的に索引を使って復習する</li>
                    <li>• カテゴリー別学習と併用する</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 関連リンク */}
            <section className="bg-white rounded-lg shadow-md p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔗 関連ページ</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  href="/terms"
                  className="group block p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="text-lg font-semibold text-blue-800 group-hover:text-blue-900 mb-2">
                    用語一覧
                  </h3>
                  <p className="text-blue-700 text-sm">
                    すべての用語を一覧で確認できます
                  </p>
                </Link>

                <Link
                  href="/categories"
                  className="group block p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="text-3xl mb-3">🗂️</div>
                  <h3 className="text-lg font-semibold text-green-800 group-hover:text-green-900 mb-2">
                    カテゴリー別
                  </h3>
                  <p className="text-green-700 text-sm">
                    分野別に整理された用語を学習
                  </p>
                </Link>

                <Link
                  href="/study-guide"
                  className="group block p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="text-3xl mb-3">🎓</div>
                  <h3 className="text-lg font-semibold text-purple-800 group-hover:text-purple-900 mb-2">
                    学習ガイド
                  </h3>
                  <p className="text-purple-700 text-sm">
                    効果的な学習方法を紹介
                  </p>
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}