'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import TermsFilter from './TermsFilter'
import { Category, Term, getDifficultyColor, getDifficultyLabel } from '../lib/microcms'

// 親コンポーネントから渡されるプロパティの型定義
type SearchableTerm = Pick<Term, 'id' | 'title' | 'slug' | 'category' | 'difficulty' | 'description' | 'publishedAt'> & { search_title?: string };

interface TermSearchClientProps {
  initialTerms: SearchableTerm[];
  categories: Category[];
}

export default function TermSearchClient({ initialTerms, categories }: TermSearchClientProps) {
  const searchParams = useSearchParams();

  // ▼▼▼ ここから変更 ▼▼▼
  // URLに検索パラメータが存在するかどうかを判定
  const isSearchActive = useMemo(() => {
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    // キーワードが入力されているか、カテゴリーか難易度が選択されている場合にtrue
    return (q && q.length > 0) || !!category || !!difficulty;
  }, [searchParams]);

  // URLのクエリパラメータに基づいて、全用語リストをクライアントサイドでフィルタリングする
  const filteredTerms = useMemo(() => {
    // 検索がアクティブでなければ、空の配列を返して何も表示しない
    if (!isSearchActive) {
      return [];
    }

    const selectedCategory = searchParams.get('category');
    const selectedDifficulty = searchParams.get('difficulty');
    const searchQuery = searchParams.get('q');

    let terms = initialTerms;

    // カテゴリーで絞り込み
    if (selectedCategory) {
      terms = terms.filter(term => term.category?.id === selectedCategory);
    }
    // 難易度で絞り込み
    if (selectedDifficulty) {
      terms = terms.filter(term => term.difficulty.includes(selectedDifficulty));
    }
    // キーワードで絞り込み
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      terms = terms.filter(term => 
        term.search_title?.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return terms;
  }, [initialTerms, searchParams, isSearchActive]);
  // ▲▲▲ ここまで変更 ▲▲▲
  
  return (
    <>
      <header className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">IT用語検索</h1>
          <Link href="/super-index" className="text-sm font-medium text-blue-600 hover:underline">
            スーパー索引へ →
          </Link>
        </div>
        <p className="text-gray-600 mb-6">
          情報処理技術者試験で問われるIT用語を中心に収録しています。<br />
          キーワード入力や、難易度・カテゴリーでの絞り込みで効率的に検索しましょう。
        </p>
        <TermsFilter categories={categories} totalCount={filteredTerms.length} />
      </header>
      
      {/* ▼▼▼ ここから変更 ▼▼▼ */}
      {/* 検索がアクティブな時だけ結果を表示する */}
      {isSearchActive ? (
        filteredTerms.length > 0 ? (
          <div className="space-y-4 mb-8">
            {filteredTerms.map((term) => (
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
                      <div className="flex items-center space-x-2 mr-4">
                        <span className="text-lg">{term.category.icon}</span>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {term.category.name}
                        </span>
                      </div>
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
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">用語が見つかりません</h3>
            <p className="text-gray-600 mb-6">
              選択した条件に該当する用語がありません。<br />
              フィルター条件を変更してお試しください。
            </p>
            <Link 
              href="/terms" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              検索条件をリセット
            </Link>
          </div>
        )
      ) : (
        // 検索がアクティブでない（初期状態の）場合に表示するメッセージ
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">⌨️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">用語を検索してください</h3>
          <p className="text-gray-600">
            上の検索ボックスやフィルターを使って、目的のIT用語を探してみましょう。
          </p>
        </div>
      )}
      {/* ▲▲▲ ここまで変更 ▲▲▲ */}
    </>
  )
}