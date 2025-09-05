import { Metadata } from 'next'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import { getCategories } from '../../lib/microcms'
import { getAllSearchableTerms } from '../../lib/microcms'
import TermSearchClient from '../../components/TermSearchClient'

export const metadata: Metadata = {
  title: 'IT用語一覧 - IT言葉辞典',
  description: 'IT用語の一覧です。キーワード検索やカテゴリー、難易度での絞り込みで、学習中や実務で気になった用語を瞬時に見つけられます。あなたのIT学習を強力にサポートします。',
}

// このページは静的生成（SSG）され、初回アクセスが高速になります
export const dynamic = 'force-static';

export default async function TermsPage() {
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