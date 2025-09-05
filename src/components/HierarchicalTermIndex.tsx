// src/components/HierarchicalTermIndex.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HierarchicalCategoryWithTerms, IndexTerm } from '../lib/microcms';

// --- 型定義 ---
type OpenState = {
  0: string[];      // 親 (level 0): 常に全てのIDを保持
  1: string | null; // 子 (level 1)
  2: string | null; // 孫 (level 2)
};
type CategoryLevel = 0 | 1 | 2;

// --- サブコンポーネント ---

/**
 * 用語リストコンポーネント
 */
const TermList = ({ terms }: { terms: IndexTerm[] }) => {
  if (terms.length === 0) {
    return (
      <div className="pt-3 pb-4 pl-12">
        <p className="text-sm text-gray-500">このカテゴリーに属する用語はまだありません。</p>
      </div>
    );
  }

  return (
    <ul className="pt-3 pb-4 pl-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1 gap-x-6 list-disc list-inside">
      {terms.map((term) => (
        <li key={term.id} className="truncate marker:text-gray-400">
          <Link
            href={`/terms/${term.slug}`}
            className="text-sm text-gray-700 hover:text-blue-600 hover:underline"
            title={term.title}
          >
            {term.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

/**
 * カテゴリー行（再帰コンポーネント）
 */
const CategoryNode = ({ category, level, openIds, onToggle, isLast }: {
  category: HierarchicalCategoryWithTerms;
  level: CategoryLevel;
  openIds: OpenState;
  onToggle: (level: CategoryLevel, id: string) => void;
  isLast: boolean;
}) => {
  const shouldRenderChildren =
    level === 0 ||
    (level === 1 && openIds[1] === category.id) ||
    (level === 2 && openIds[2] === category.id);

  const isSelfActive =
    (level === 1 && openIds[1] === category.id) ||
    (level === 2 && openIds[2] === category.id);
  const isDescendantActive =
    (level === 0 && category.children.some(child => child.id === openIds[1])) ||
    (level === 1 && category.children.some(child => child.id === openIds[2]));
  const isHighlighted = isSelfActive || isDescendantActive;
  
  const hasChildren = !!category.children?.length;
  // 'hasTerms'はisExpandableのロジックで使われているので残しておきます
  const hasTerms = category.terms != null; 
  const isExpandable = hasChildren || (level === 2 && hasTerms);
  const isClickable = level > 0 && isExpandable;

  const lineColor = isHighlighted ? 'bg-blue-400' : 'bg-gray-200';
  const highlightClass = isHighlighted ? 'bg-blue-50/80' : '';
  const textHighlightClass = isHighlighted ? 'text-blue-600 font-semibold' : 'text-gray-800';

  return (
    <div className="relative">
      <div className={`absolute top-0 left-5 h-full w-px ${lineColor} ${isLast ? 'h-[18px]' : ''} ${level === 0 ? 'hidden' : ''}`} />
      <div className={`absolute top-[18px] left-5 w-4 h-px ${lineColor} ${level === 0 ? 'hidden' : ''}`} />
      
      <div
        className={`flex items-center py-2 group transition-colors duration-150 rounded-r-md ${isClickable ? 'cursor-pointer' : ''} ${highlightClass}`}
        style={{ paddingLeft: `${level * 1.5 + 1.25}rem` }}
        onClick={isClickable ? () => onToggle(level, category.id) : undefined}
      >
        <div className={`flex-1 pl-8 py-1 rounded-md ${isClickable ? 'hover:bg-gray-100/80' : ''}`}>
          <span className={`font-medium ${textHighlightClass} transition-colors`}>
            {level === 2 ? `・ ${category.name}` : category.name}
          </span>
        </div>
      </div>

      {shouldRenderChildren && (
        <div className="pl-3">
          {/* ▼▼▼ 修正箇所 ▼▼▼ */}
          {level === 2 && category.terms && <TermList terms={category.terms} />}
          {/* ▲▲▲ 修正箇所 ▲▲▲ */}
          {hasChildren && (
            <div>
              {category.children.map((child, index, arr) => (
                <CategoryNode
                  key={child.id}
                  category={child}
                  level={(level + 1) as CategoryLevel}
                  openIds={openIds}
                  onToggle={onToggle}
                  isLast={index === arr.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- メインコンポーネント ---

interface HierarchicalTermIndexProps {
  data: HierarchicalCategoryWithTerms[];
}

export default function HierarchicalTermIndex({ data }: HierarchicalTermIndexProps) {
  const [openIds, setOpenIds] = useState<OpenState>({
    0: data.map(cat => cat.id),
    1: null,
    2: null,
  });

  const handleToggle = (level: CategoryLevel, id: string) => {
    if (level === 0) return;

    setOpenIds(prev => {
      const isCurrentlyOpen = prev[level] === id;
      const newId = isCurrentlyOpen ? null : id;

      switch (level) {
        case 1:
          return { ...prev, 1: newId, 2: null };
        case 2:
          return { ...prev, 2: newId };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <header className="p-6 md:p-8 border-b bg-gray-50/80">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center">
          カテゴリー索引
        </h2>
      </header>
      <div className="p-2">
        {data.map((category, index, arr) => (
          <CategoryNode
            key={category.id}
            category={category}
            level={0}
            openIds={openIds}
            onToggle={handleToggle}
            isLast={index === arr.length - 1}
          />
        ))}
      </div>
    </div>
  );
}