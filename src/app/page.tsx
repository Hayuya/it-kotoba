import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import IndexSidebar from '../components/IndexSidebar'
import LatestArticles from '../components/LatestArticles'
import { getCategories, getStats, getAllTermSlugs } from '../lib/microcms'

// メタデータをindexページのものに更新
export const metadata: Metadata = {
  title: 'IT合言葉 - 情報処理安全確保支援士試験対策',
  description: '情報処理安全確保支援士試験対策のためのIT用語解説サイト。試験範囲を完全網羅した分かりやすい解説で合格をサポートします。',
}

// 索引の統計情報を取得する関数を追加
async function getIndexStats() {
  try {
    const allSlugs = await getAllTermSlugs();
    const alphabetStats = new Map<string, number>();
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      alphabetStats.set(letter, 0);
    });
    let numberCount = 0;

    allSlugs.forEach(slug => {
      if (slug.match(/^[a-zA-Z]/)) {
        const firstLetter = slug.charAt(0).toUpperCase();
        alphabetStats.set(firstLetter, (alphabetStats.get(firstLetter) || 0) + 1);
      } else if (slug.match(/^[0-9]/)) {
        numberCount++;
      }
    });

    return {
      alphabet: alphabetStats,
      number: numberCount,
      total: allSlugs.length
    };
  } catch (error) {
    console.error('Error getting index stats:', error);
    return {
      alphabet: new Map(),
      number: 0,
      total: 0
    };
  }
}


export default async function Home() {
  // データを取得
  const [categories, stats, indexStats] = await Promise.all([
    getCategories(),
    getStats(),
    getIndexStats()
  ]);

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
            {/* ヒーローセクション */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
              <h1 className="text-4xl font-bold mb-4">IT合言葉</h1>
              <p className="text-xl mb-6">
                情報処理安全確保支援士試験対策のための<br />
                IT用語解説サイト
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">⚪️ 最新シラバスに準拠</span>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">⚪️ 現実主義</span>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">⚪️ わかりやすさ重視</span>
                </div>
              </div>
            </section>

            {/* 新着記事セクション */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📰 新着記事</h2>
                <Link 
                  href="/terms" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  すべての記事を見る →
                </Link>
              </div>
              <LatestArticles />
            </section>
            
            {/* 統計情報 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">📊 サイト統計</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.totalTerms}+
                  </div>
                  <div className="text-gray-600">登録用語数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.totalCategories}
                  </div>
                  <div className="text-gray-600">カテゴリー数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">毎日更新</div>
                  <div className="text-gray-600">更新頻度</div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}