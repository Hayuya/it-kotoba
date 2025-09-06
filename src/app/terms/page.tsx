// src/app/terms/page.tsx

import { Metadata } from 'next'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import { getAllSearchableTerms } from '../../lib/microcms'
import TermSearchClient from '../../components/TermSearchClient'

export const metadata: Metadata = {
  title: 'IT用語一覧 - IT言葉',
  description: 'IT用語の一覧です。情報処理安全確保支援士試験レベルから基礎用語まで、キーワード検索や難易度で絞り込んで効率的に学習できます。',
}

export const dynamic = 'force-static';

export default async function TermsPage() {
  const allTerms = await getAllSearchableTerms();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <IndexSidebar />
          </aside>
          <main className="lg:w-3/4">
            <TermSearchClient 
              initialTerms={allTerms} 
            />
          </main>
        </div>
      </div>
    </div>
  )
}