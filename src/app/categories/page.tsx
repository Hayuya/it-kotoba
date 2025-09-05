// src/app/categories/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import IndexSidebar from '../../components/IndexSidebar';
import HierarchicalTermIndex from '../../components/HierarchicalTermIndex';
import { getCategories, getHierarchicalCategoriesWithTerms } from '../../lib/microcms';

export const metadata: Metadata = {
  title: 'カテゴリー索引 - IT言葉',
  description: 'すべてのIT用語をカテゴリー別に階層表示。親子関係を辿りながら体系的に知識を広げられます。',
};

export const dynamic = 'force-static';

export default async function CategoriesIndexPage() {
  // サイドバー用の親カテゴリーと、メインコンテンツ用の階層化データを取得
  const [categories, hierarchicalData] = await Promise.all([
    getCategories(),
    getHierarchicalCategoriesWithTerms()
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
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">カテゴリー索引</h1>
                <Link href="/super-index" className="text-sm font-medium text-blue-600 hover:underline">
                  50音順の索引へ →
                </Link>
              </div>
              <p className="text-gray-600 leading-relaxed">
                すべてのIT用語をカテゴリー別に階層表示しています。<br />
                親子関係を辿りながら、関連知識を体系的に学習しましょう。
              </p>
            </header>
            
            {/* 階層索引コンポーネントを描画 */}
            <HierarchicalTermIndex data={hierarchicalData} />
            
          </main>
        </div>
      </div>
    </div>
  );
}