import Link from 'next/link'
import Header from '../components/Header'
import IndexSidebar from '../components/IndexSidebar'
import { getCategories } from '../lib/microcms'

export default async function NotFound() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <IndexSidebar categories={categories} />
          </aside>
          <main className="lg:w-3/4 flex items-center justify-center">
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
              <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">ページが見つかりません</h2>
              <p className="text-gray-600 mb-8">
                お探しのページは削除されたか、URLが変更された可能性があります。
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ホームに戻る
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}