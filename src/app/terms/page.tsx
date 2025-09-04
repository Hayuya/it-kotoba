import { Metadata } from 'next'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import { getCategories } from '../../lib/microcms'
import { getAllSearchableTerms } from '../../lib/microcms'
import TermSearchClient from '../../components/TermSearchClient' // ★ 新しいクライアントコンポーネントをインポート

export const metadata: Metadata = {
  title: 'IT用語一覧 - IT言葉',
  description: 'IT用語の一覧です。情報処理安全確保支援士試験レベルから基礎用語まで、キーワード検索やカテゴリー、難易度で絞り込んで効率的に学習できます。',
}

// このページは静的生成（SSG）され、初回アクセスが高速になります
export const dynamic = 'force-static';

export default async function TermsPage() {
  // ▼▼▼【変更点】ビルド時に全カテゴリーと全用語データを取得する ▼▼▼
  const [categories, allTerms] = await Promise.all([
    getCategories(),
    getAllSearchableTerms() 
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <IndexSidebar categories={categories} />
          </aside>
          <main className="lg:w-3/4">
            {/* ▼▼▼【変更点】実際の検索処理はすべてクライアントコンポーネントに任せる ▼▼▼ */}
            <TermSearchClient 
              initialTerms={allTerms} 
              categories={categories} 
            />
          </main>
        </div>
      </div>
    </div>
  )
}