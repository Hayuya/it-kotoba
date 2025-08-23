import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import IndexSidebar from '../../../components/IndexSidebar'
import { 
  getCategoryBySlug,
  getCategories,
  getTermsByCategory,
  getDifficultyColor,
  getDifficultyLabel
} from '../../../lib/microcms'

interface Props {
  params: { slug: string }
  searchParams: { page?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: 'カテゴリーが見つかりません - IT合言葉'
    }
  }

  return {
    title: `${category.name}の用語一覧 - IT合言葉`,
    description: category.description || `${category.name}に関連するIT用語の解説一覧`,
    openGraph: {
      title: `${category.name}の用語一覧 - IT合言葉`,
      description: category.description || `${category.name}に関連するIT用語の解説一覧`,
    }
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const currentPage = parseInt(searchParams.page || '1')
  const limit = 12
  const offset = (currentPage - 1) * limit

  const [category, categories, termsResponse] = await Promise.all([
    getCategoryBySlug(params.slug),
    getCategories(),
    getTermsByCategory(params.slug, { limit, offset, orders: 'order' })
  ])
  
  if (!category) {
    notFound()
  }

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
                <li>
                  <Link href="/categories" className="hover:text-blue-600">
                    カテゴリー
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-800 font-medium">{category.name}</li>
              </ol>
            </nav>

            {/* カテゴリーヘッダー */}
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                  <p className="text-gray-600 mt-2">
                    {category.description || `${category.name}に関連するIT用語の解説`}
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  📊 このカテゴリーには <strong>{termsResponse.totalCount}個</strong> の用語が登録されています
                </p>
              </div>
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
                        {term.tags && term.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {term.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag.id}
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                              >
                                #{tag.name}
                              </span>
                            ))}
                            {term.tags.length > 2 && (
                              <span className="text-gray-500 text-xs">
                                +{term.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
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
                        href={`/category/${params.slug}?page=${currentPage - 1}`}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        前へ
                      </Link>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={`/category/${params.slug}?page=${page}`}
                        className={`px-3 py-2 rounded-lg ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                    
                    {currentPage < totalPages && (
                      <Link
                        href={`/category/${params.slug}?page=${currentPage + 1}`}
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
                <p className="text-gray-600 mb-4">
                  このカテゴリーにはまだ用語が登録されていません。
                </p>
                <Link 
                  href="/terms" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  すべての用語を見る →
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}