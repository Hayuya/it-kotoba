import { Metadata } from 'next'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import { getTerms, Term } from '../../lib/microcms'
import Link from 'next/link'
import { getDifficultyColor, getDifficultyLabel } from '../../lib/microcms'

export const metadata: Metadata = {
  title: 'おすすめ記事一覧 - IT言葉辞典',
  description: 'IT言葉辞典が厳選した、特におすすめのIT用語一覧です。',
}

export const dynamic = 'force-static';

async function getRecommendedTerms(): Promise<Term[]> {
    const response = await getTerms({
        filters: 'isRecommended[equals]true',
        limit: 100, // 必要に応じて調整
    });
    return response.contents;
}

export default async function RecommendedPage() {
  const recommendedTerms = await getRecommendedTerms();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <IndexSidebar />
          </aside>
          <main className="lg:w-3/4">
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900">おすすめ記事一覧</h1>
              <p className="text-gray-600 mt-2">IT言葉辞典が厳選した、特におすすめのIT用語一覧です。</p>
            </header>

            {recommendedTerms.length > 0 ? (
              <div className="space-y-4">
                {recommendedTerms.map((term) => (
                  <Link
                    key={term.id}
                    href={`/terms/${term.slug}`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-full mr-3 flex-shrink-0 ${getDifficultyColor(term.difficulty)}`}>
                            {getDifficultyLabel(term.difficulty)}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {term.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {term.description}
                        </p>
                      </div>
                      <div className="flex items-center ml-4 flex-shrink-0">
                        <span className="text-blue-600 text-sm font-medium group-hover:text-blue-800 hidden sm:inline">
                          詳細を見る →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">現在、おすすめの記事はありません。</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}