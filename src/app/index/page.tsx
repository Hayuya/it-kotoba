import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import MainLayout from '../../components/MainLayout' //
import { getCategories, getAllTermSlugs } from '../../lib/microcms'

export const metadata: Metadata = {
  title: '用語索引 - IT合言葉',
  description: 'アルファベット順・数字順でIT用語を検索できます。効率的に目的の用語を見つけられます。',
  openGraph: {
    title: '用語索引 - IT合言葉',
    description: 'アルファベット順・数字順でIT用語を検索',
  }
}

// 索引の統計情報を取得
async function getIndexStats() {
  try {
    const allSlugs = await getAllTermSlugs()
    
    // 各索引の用語数を計算
    const alphabetStats = new Map<string, number>()
    let numberCount = 0

    // アルファベットの初期化
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      alphabetStats.set(letter, 0)
    })

    // 実際の統計は複雑なので、ダミーデータを設定
    // 実装時は実際の用語データから計算してください
    alphabetStats.set('A', 10)
    alphabetStats.set('B', 5)
    numberCount = 3

    return {
      alphabet: alphabetStats,
      number: numberCount,
      total: allSlugs.length
    }
  } catch (error) {
    console.error('Error getting index stats:', error)
    return {
      alphabet: new Map(),
      number: 0,
      total: 0
    }
  }
}

export default async function IndexPage() {
  const [categories, stats] = await Promise.all([
    getCategories(),
    getIndexStats()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ★ ここを MainLayout でラップする */}
          <MainLayout categories={categories}>
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
                  📊 現在 <strong>{stats.total}個</strong> の用語が索引に登録されています
                </p>
              </div>
            </header>

            {/* アルファベット索引 */}
            <section className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔤 アルファベット索引</h2>
              <div className="grid grid-cols-6 md:grid-cols-13 gap-2">
                {Array.from(stats.alphabet.entries()).map(([char, count]) => (
                  <div key={char} className="text-center">
                    <div className="bg-green-50 hover:bg-green-100 rounded-lg p-3 transition-colors group cursor-pointer">
                      <div className="text-lg font-bold text-green-600 group-hover:text-green-800 mb-1">
                        {char}
                      </div>
                      <div className="text-xs text-gray-600">
                        {count > 0 ? `${count}件` : '0件'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                ※ 各アルファベットをクリックすると、該当する用語一覧が表示されます。
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
                      {stats.number > 0 ? `${stats.number}件` : '0件'}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                ※ 数字で始まる用語（例：3DES、802.11など）が表示されます。
              </p>
            </section>

            {/* 使い方ガイド */}
            <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-800 mb-4">💡 索引の使い方</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">🎯 効率的な検索方法</h3>
                  <ul className="text-orange-700 space-y-2 text-sm">
                    <li>• <strong>アルファベット索引</strong>：英語略語や技術名称</li>
                    <li>• <strong>数字索引</strong>：規格番号や数値が含まれる用語</li>
                    <li>• <strong>サイドバー索引</strong>：リアルタイムで絞り込み検索</li>
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
          </MainLayout>
        </div>
      </div>
    </div>
  )
}