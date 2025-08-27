import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import TermsFilter from '../../components/TermsFilter'
import { 
  getTerms, 
  getCategories, 
  getDifficultyColor, 
  getDifficultyLabel 
} from '../../lib/microcms'

interface Props {
  searchParams: { page?: string; category?: string; difficulty?: string }
}

export const metadata: Metadata = {
  title: 'IT用語一覧 - IT言葉',
  // ▼▼▼ 変更箇所 ▼▼▼
  description: 'IT用語の一覧です。情報処理安全確保支援士試験レベルから基礎用語まで、カテゴリーや難易度で絞り込んで効率的に学習できます。',
  openGraph: {
    title: 'IT用語一覧 - IT言葉',
    description: '情報処理技術に関するIT用語を一覧表示',
  }
  // ▲▲▲ 変更箇所 ▲▲▲
}

export default async function TermsPage({ searchParams }: Props) {
  const currentPage = parseInt(searchParams.page || '1')
  const selectedCategory = searchParams.category
  const selectedDifficulty = searchParams.difficulty
  const limit = 12
  const offset = (currentPage - 1) * limit

  // フィルター条件を構築
  let filters: string[] = []
  if (selectedCategory) {
    filters.push(`category[equals]${selectedCategory}`)
  }
  if (selectedDifficulty) {
    // 難易度フィルターを[contains]に変更
    filters.push(`difficulty[contains]${selectedDifficulty}`)
  }

  const [termsResponse, categories] = await Promise.all([
    getTerms({
      limit,
      offset,
      orders: 'order',
      filters: filters.length > 0 ? filters.join('[and]') : undefined
    }),
    getCategories()
  ])

  const totalPages = Math.ceil(termsResponse.totalCount / limit)

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
                <li className="text-gray-800 font-medium">用語一覧</li>
              </ol>
            </nav>

            {/* ヘッダーセクション */}
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">IT用語一覧</h1>
              <p className="text-gray-600 mb-6">
                {/* ▼▼▼ 変更箇所 ▼▼▼ */}
                情報処理技術者試験で問われるIT用語を網羅的に学習できます。
                難易度やカテゴリーで絞り込んで効率的に学習しましょう。
                {/* ▲▲▲ 変更箇所 ▲▲▲ */}
              </p>
              
              {/* フィルター */}
              <TermsFilter categories={categories} totalCount={termsResponse.totalCount} />
            </header>

            {/* 用語一覧 */}
            {termsResponse.contents.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {termsResponse.contents.map((term) => (
                    <Link
                      key={term.id}
                      href={`/terms/${term.slug}`}
                      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {term.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(term.difficulty)}`}>
                          {getDifficultyLabel(term.difficulty)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {term.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{term.category.icon}</span>
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {term.category.name}
                          </span>
                        </div>
                        <span className="text-blue-600 text-sm font-medium group-hover:text-blue-800">
                          詳細を見る →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* ページネーション */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/terms?page=${currentPage - 1}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedDifficulty ? `&difficulty=${selectedDifficulty}` : ''}`}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        前へ
                      </Link>
                    )}
                    
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let page
                      if (totalPages <= 7) {
                        page = i + 1
                      } else if (currentPage <= 4) {
                        page = i + 1
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i
                      } else {
                        page = currentPage - 3 + i
                      }
                      
                      return (
                        <Link
                          key={page}
                          href={`/terms?page=${page}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedDifficulty ? `&difficulty=${selectedDifficulty}` : ''}`}
                          className={`px-3 py-2 rounded-lg ${
                            page === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </Link>
                      )
                    })}
                    
                    {currentPage < totalPages && (
                      <Link
                        href={`/terms?page=${currentPage + 1}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedDifficulty ? `&difficulty=${selectedDifficulty}` : ''}`}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        次へ
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">用語が見つかりません</h3>
                <p className="text-gray-600 mb-6">
                  選択した条件に該当する用語がありません。<br />
                  フィルター条件を変更してお試しください。
                </p>
                <Link 
                  href="/terms" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  すべての用語を表示
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}