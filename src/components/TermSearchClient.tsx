'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import TermsFilter from './TermsFilter'
import { Term, getDifficultyColor, getDifficultyLabel } from '../lib/microcms'

type SearchableTerm = Pick<Term, 'id' | 'title' | 'slug' | 'difficulty' | 'description' | 'publishedAt'> & { search_title?: string };

interface TermSearchClientProps {
  initialTerms: SearchableTerm[];
}

// ▼▼▼ ここからスコアリングロジックを追加 ▼▼▼
/**
 * 用語と検索クエリの関連性スコアを計算する関数
 * @param term - 評価対象の用語オブジェクト
 * @param query - 小文字化された検索クエリ
 * @returns スコア (高いほど関連性が高い)
 */
const calculateRelevanceScore = (term: SearchableTerm, query: string): number => {
  const title = term.title.toLowerCase();
  
  // 1. 完全一致 (最高スコア)
  if (title === query) {
    return 100;
  }
  
  // 2. 前方一致
  if (title.startsWith(query)) {
    return 90;
  }
  
  // 3. 単語として一致 (正規表現で単語の境界をチェック)
  const wordBoundaryRegex = new RegExp(`\\b${query}\\b`);
  if (wordBoundaryRegex.test(title)) {
    return 80;
  }

  // 4. search_title (別名)での前方一致
  const searchTitle = term.search_title?.toLowerCase() || '';
  if (searchTitle.split(',').some(t => t.trim().startsWith(query))) {
    return 70;
  }

  // 5. 部分一致 (デフォルト)
  return 10;
};
// ▲▲▲ ここまでスコアリングロジックを追加 ▲▲▲

export default function TermSearchClient({ initialTerms }: TermSearchClientProps) {
  const searchParams = useSearchParams();

  const isSearchActive = useMemo(() => {
    const q = searchParams.get('q');
    const difficulty = searchParams.get('difficulty');
    return (q && q.length > 0) || !!difficulty;
  }, [searchParams]);

  const filteredTerms = useMemo(() => {
    if (!isSearchActive) {
      return [];
    }

    const selectedDifficulty = searchParams.get('difficulty');
    const searchQuery = searchParams.get('q');
    const lowerCaseQuery = searchQuery?.toLowerCase() || '';

    let terms = initialTerms;

    if (selectedDifficulty) {
      terms = terms.filter(term => term.difficulty.includes(selectedDifficulty));
    }
    
    if (searchQuery) {
      terms = terms.filter(term => 
        term.title.toLowerCase().includes(lowerCaseQuery) ||
        term.search_title?.toLowerCase().includes(lowerCaseQuery)
      );

      // ▼▼▼ ここからソート処理を追加 ▼▼▼
      terms.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a, lowerCaseQuery);
        const scoreB = calculateRelevanceScore(b, lowerCaseQuery);
        
        // スコアが異なる場合は、スコアの高い方を優先
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        
        // スコアが同じ場合は、文字コード順で並び替え
        return a.title.localeCompare(b.title);
      });
      // ▲▲▲ ここまでソート処理を追加 ▲▲▲
    }

    return terms;
  }, [initialTerms, searchParams, isSearchActive]);
  
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
          キーワード入力や、難易度での絞り込みで効率的に検索しましょう。
        </p>
        <TermsFilter totalCount={filteredTerms.length} />
      </header>
      
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
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">⌨️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">用語を検索してください</h3>
          <p className="text-gray-600">
            上の検索ボックスやフィルターを使って、目的のIT用語を探してみましょう。
          </p>
        </div>
      )}
    </>
  )
}