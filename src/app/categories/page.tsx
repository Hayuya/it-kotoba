import { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import IndexSidebar from '../../components/IndexSidebar';
import { getAllCategories, getAllSearchableTerms } from '../../lib/microcms';
import CategoryTree from '../../components/CategoryTree';

export const metadata: Metadata = {
  title: 'カテゴリー一覧 - IT言葉辞典',
  description: 'IT用語をカテゴリーから探せます。技術分野や体系ごとに整理された用語を効率的に学習できます。',
};

export const dynamic = 'force-static';

export default async function CategoriesPage() {
  const [allCategories, allTerms] = await Promise.all([
    getAllCategories(),
    getAllSearchableTerms()
  ]);

  const termsByCategoryId = allTerms.reduce((acc, term) => {
    const categories = term.category 
      ? (Array.isArray(term.category) ? term.category : [term.category]) 
      : [];
      
    categories.forEach(cat => {
      if (cat && cat.id) {
        if (!acc[cat.id]) {
          acc[cat.id] = [];
        }
        acc[cat.id].push({
          id: term.id,
          title: term.title,
          slug: term.slug
        });
      }
    });
    return acc;
  }, {} as { [key: string]: { id: string; title: string; slug: string }[] });


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
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">カテゴリ一覧</h1>
                <div className="flex flex-col items-end space-y-2">
                  <Link href="/terms" className="text-sm font-medium text-blue-600 hover:underline">
                    用語検索へ →
                  </Link>
                  <Link href="/super-index" className="text-sm font-medium text-purple-600 hover:underline">
                    スーパー索引へ →
                  </Link>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                IT用語をカテゴリーから探せます。<br />
                ツリーを開いて、関連する用語を体系的に学びましょう。
              </p>
            </header>
            
            <CategoryTree categories={allCategories} termsByCategoryId={termsByCategoryId} />

          </main>
        </div>
      </div>
    </div>
  );
}