// src/app/super-index/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import IndexSidebar from '../../components/IndexSidebar';
import {getAllSearchableTerms } from '../../lib/microcms';
import SuperIndexClient from '../../components/SuperIndexClient';

export const metadata: Metadata = {
  title: 'スーパー索引 - IT言葉',
  description: 'すべてのIT用語をアルファベット順にリストアップ。高速な索引機能で目的の用語を素早く見つけられます。',
};

export const dynamic = 'force-static';

export default async function SuperIndexPage() {
  const [allTerms] = await Promise.all([
    getAllSearchableTerms()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <IndexSidebar/>
          </aside>
          <main className="lg:w-3/4">
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">スーパー索引</h1>
                <div className="flex flex-col items-end space-y-2">
                  <Link href="/terms" className="text-sm font-medium text-blue-600 hover:underline">
                    用語検索へ →
                  </Link>
                  <Link href="/categories" className="text-sm font-medium text-green-600 hover:underline">
                    カテゴリ一覧へ →
                  </Link>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                すべてのIT用語をアルファベット順にリストアップしています。<br />
                セクションを開いて目的の用語を素早く見つけましょう。
              </p>
            </header>
            <SuperIndexClient allTerms={allTerms} />
          </main>
        </div>
      </div>
    </div>
  );
}