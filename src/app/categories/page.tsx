import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'
import { getAllCategories, getStats } from '../../lib/microcms'

export const metadata: Metadata = {
  title: 'カテゴリー一覧 - IT合言葉',
  description: '情報処理安全確保支援士試験対策のIT用語をカテゴリー別に分類。効率的な学習でスキルアップを目指しましょう。',
  openGraph: {
    title: 'カテゴリー一覧 - IT合言葉',
    description: '情報処理安全確保支援士試験対策のIT用語をカテゴリー別に分類',
  }
}

export default async function CategoriesPage() {
  const [categories, stats] = await Promise.all([
    getAllCategories(), // getCategories から getAllCategories に変更
    getStats()
  ])

  // 親カテゴリーと子カテゴリーを分離
  const parentCategories = categories.filter(cat => !cat.parent)
  const childCategories = categories.filter(cat => !!cat.parent)

  console.log('カテゴリーページ - 全カテゴリー数:', categories.length)
  console.log('カテゴリーページ - 親カテゴリー数:', parentCategories.length)
  console.log('カテゴリーページ - 子カテゴリー数:', childCategories.length)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー */}
          <aside className="lg:w-1/4">
            <Sidebar categories={categories} />
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
                <li className="text-gray-800 font-medium">カテゴリー一覧</li>
              </ol>
            </nav>

            {/* ヘッダーセクション */}
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">カテゴリー一覧</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                情報処理安全確保支援士試験の学習範囲を体系的に分類しています。
                各カテゴリーから興味のある分野を選んで効率的に学習を進めましょう。
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  全 <strong>{categories.length}個</strong> のカテゴリーに <strong>{stats.totalTerms}個</strong> の用語が登録されています
                  {parentCategories.length > 0 && (
                    <span className="ml-2">
                      （親カテゴリー: {parentCategories.length}個、子カテゴリー: {childCategories.length}個）
                    </span>
                  )}
                </p>
              </div>
            </header>

            {/* カテゴリー一覧 */}
            {categories.length > 0 ? (
              <div className="space-y-8">
                {/* 親カテゴリーが存在する場合は階層表示 */}
                {parentCategories.length > 0 && parentCategories.length < categories.length ? (
                  <>
                    {/* 親カテゴリー */}
                    {parentCategories.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">主要カテゴリー</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {parentCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/category/${category.slug}`}
                              className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:-translate-y-1"
                            >
                              <div className="text-center">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                  {category.icon || '📁'}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-3">
                                  {category.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                  {category.description || `${category.name}に関連するIT用語とセキュリティの基礎知識を学習できます。`}
                                </p>
                                <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-800 font-medium text-sm">
                                  用語を学習する
                                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* 子カテゴリー */}
                    {childCategories.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">詳細カテゴリー</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {childCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/category/${category.slug}`}
                              className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{category.icon || '📄'}</span>
                                <div>
                                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm">
                                    {category.name}
                                  </h4>
                                  {category.parent && (
                                    <p className="text-xs text-gray-500">
                                      {category.parent.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  /* フラット表示 */
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:-translate-y-1"
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {category.icon || '📁'}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-3">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {category.description || `${category.name}に関連するIT用語とセキュリティの基礎知識を学習できます。`}
                          </p>
                          <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-800 font-medium text-sm">
                            用語を学習する
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">カテゴリーが見つかりません</h3>
                <p className="text-gray-600 mb-6">
                  まだカテゴリーが登録されていません。<br />
                  しばらくお待ちください。
                </p>
                <Link 
                  href="/" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ホームに戻る
                </Link>
              </div>
            )}

            {/* 学習ガイド */}
            <section className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 効果的な学習方法</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📖 基礎から応用へ</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 基本的なセキュリティ概念から学習開始</li>
                    <li>• 段階的に専門用語を習得</li>
                    <li>• 実際の事例と関連付けて理解</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">🔄 反復学習のコツ</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 定期的な復習で記憶を定着</li>
                    <li>• 関連用語をまとめて学習</li>
                    <li>• 過去問題で実践的な理解を深化</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link 
                  href="/study-guide"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  詳しい学習ガイドを見る
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}