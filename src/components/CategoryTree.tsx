'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { CategoryTreeNode } from '../lib/categoryUtils';
import type { Term } from '../lib/microcms';

type SimpleTerm = Pick<Term, 'id' | 'title' | 'slug'>;

// 再帰的に子カテゴリーを描画するコンポーネント
const CategoryNode = ({ node }: { node: CategoryTreeNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [terms, setTerms] = useState<SimpleTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 孫カテゴリーかどうかを判定 (childrenがなく、parentがいる)
  const isGrandchild = !node.children || node.children.length === 0;

  const handleClick = useCallback(async () => {
    if (!isGrandchild) return;

    // 開閉状態をトグル
    setIsOpen(prev => !prev);

    // すでに用語を取得済みの場合はAPIを叩かない
    if (terms.length > 0) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/terms-by-category/${node.id}`);
      const result = await response.json();
      
      if (result.success) {
        setTerms(result.data);
      } else {
        throw new Error(result.error || '用語の取得に失敗しました。');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  }, [node.id, isGrandchild, terms.length]);

  const NodeContent = (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{node.name}</span>
      {isGrandchild && (
        <svg
          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </div>
  );

  return (
    <li className="relative pl-6">
      <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
      <div className="absolute left-0 top-[1.1rem] h-px w-4 bg-gray-200"></div>
      
      {isGrandchild ? (
        <button onClick={handleClick} className="w-full text-left font-medium hover:bg-gray-50 rounded px-2">
          {NodeContent}
        </button>
      ) : (
        <div className="font-medium px-2">{NodeContent}</div>
      )}

      {isOpen && (
        <div className="pl-4 mt-2 mb-2 border-l border-gray-300">
          {isLoading && <p className="text-sm text-gray-500 py-2">読み込み中...</p>}
          {error && <p className="text-sm text-red-500 py-2">{error}</p>}
          {terms.length > 0 && (
            <ul className="space-y-1">
              {terms.map(term => (
                <li key={term.id}>
                  <Link href={`/terms/${term.slug}`} className="block text-sm text-blue-600 hover:underline p-1 rounded hover:bg-blue-50">
                    - {term.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && !error && terms.length === 0 && isOpen && (
             <p className="text-sm text-gray-400 py-2">- 用語がありません -</p>
          )}
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <ul className="pl-4">
          {node.children.map((childNode) => (
            <CategoryNode key={childNode.id} node={childNode} />
          ))}
        </ul>
      )}
    </li>
  );
};


// カテゴリーツリー全体をラップする親コンポーネント
interface CategoryTreeProps {
  categoryTree: CategoryTreeNode[];
}

export default function CategoryTree({ categoryTree }: CategoryTreeProps) {
  if (!categoryTree || categoryTree.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        📂 カテゴリーから探す
      </h2>
      <div className="container mx-auto px-4">
        <ul>
          {categoryTree.map((rootNode) => (
            <li key={rootNode.id} className="mb-4">
              <div className="py-2 text-lg font-bold text-gray-800">
                {rootNode.name}
              </div>
              {rootNode.children && rootNode.children.length > 0 && (
                 <ul className="pl-4">
                  {rootNode.children.map((childNode) => (
                    <CategoryNode key={childNode.id} node={childNode} />
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}