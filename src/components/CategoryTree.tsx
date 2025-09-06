'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Category, Term } from '../lib/microcms'

// (型定義は変更なし)
type TermNode = Pick<Term, 'id' | 'title' | 'slug'>;
type CategoryNode = Category & { children: CategoryNode[] };
type TermsByCategoryId = { [key: string]: TermNode[] };

interface CategoryTreeProps {
  categories: Category[];
  termsByCategoryId: TermsByCategoryId;
}

const categoryOrder: { [key: string]: number } = {
  "2sbxk7u4q": 1, "yyrldm8utr": 2, "0us4_j_riw0": 3, "lrj8396k4vw": 4, "4nib0y_53": 5,
  "txluey5p5d8j": 101, "vetmdwpl0ttm": 102, "3wlyqv6fq523": 201, "vdeq3r-3wdo": 301, "rji2h30zg3": 302,
  "isfv_m4ohr": 401, "ryikl-6p15h": 402, "5ur8esk554-3": 403, "1mmhi2qr8": 501, "e_lo-lype": 502, "n_xd6d598i": 503,
  "6pmovyd5xze": 10101, "o28n-r1vx": 10102, "36uf8khe-lmi": 10103, "157ktw9cyj": 10201, "bqlo6u1y8h4": 10202,
  "7lze-oux6wl": 10203, "bw2x42256e8y": 20101, "0gstb-qlvgfz": 20102, "senj2gljvspm": 20103, "n8srvwngx40i": 20104,
  "9h51fhxf2": 30101, "4oi7uu5uy": 30102, "kr273hzkoa2y": 30103, "orts8ktew": 30201, "kur-w5t1pp9b": 30202,
  "nu_wttibn": 30203, "trswd9_nbn": 40101, "zn9629xj5mz": 40102, "w2imz9don": 40103, "agzhspowlh": 40201,
  "94-cqhwq1-lb": 40202, "350dww0r36w": 40301, "ukm3huhxs": 40302, "s34ek9elw": 50101, "oebgqmfm6": 50102,
  "4giqyddnq3dg": 50201, "g4i3dy4dtj": 50202, "bca8iagha": 50301, "ka7fkf4zpax": 50302
};

const CategoryItem = ({ 
  node, 
  level, 
  termsByCategoryId,
  openCategoryId,
  onCategoryClick,
  openInNewTab
}: { 
  node: CategoryNode; 
  level: number;
  termsByCategoryId: TermsByCategoryId;
  openCategoryId: string | null;
  onCategoryClick: (id: string) => void;
  openInNewTab: boolean;
}) => {
  const isGrandChild = level === 2;
  const isOpen = openCategoryId === node.id;
  
  const terms = useMemo(() => {
    const termList = termsByCategoryId[node.id] || [];
    return [...termList].sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
  }, [termsByCategoryId, node.id]);

  return (
    <div style={{ marginLeft: `${level > 0 ? 1.25 : 0}rem` }} className="border-l border-gray-200 first:border-l-0">
      <div className={level > 0 ? "relative before:content-[''] before:absolute before:left-[-1px] before:top-1/2 before:w-4 before:h-px before:bg-gray-200" : ""}>
        {isGrandChild ? (
          <button 
            onClick={() => onCategoryClick(node.id)}
            className="flex items-center w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="flex-grow text-gray-700">{node.name}</span>
            {terms.length > 0 && (
              <span className="text-sm text-gray-500 mr-2">{terms.length}件</span>
            )}
            {terms.length > 0 && (
              <svg 
                className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        ) : (
          <div className="py-2 px-3 text-gray-800 font-semibold">{node.name}</div>
        )}
      </div>
      
      {/* ▼▼▼ ここから展開エリアのUIを修正 ▼▼▼ */}
      {isGrandChild && isOpen && terms.length > 0 && (
        <div className="my-2 ml-4 bg-gray-50 rounded-lg p-3">
          <ul className="space-y-1 list-none pl-0">
            {terms.map(term => (
              <li key={term.id} className="flex items-start">
                <span className="text-gray-400 mr-2 mt-1.5">&middot;</span>
                <Link 
                  href={`/terms/${term.slug}`}
                  target={openInNewTab ? '_blank' : '_self'}
                  rel={openInNewTab ? 'noopener noreferrer' : ''}
                  className="flex-1 block px-2 py-1 rounded-md text-sm text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-colors duration-150"
                >
                  {term.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* ▲▲▲ ここまで修正 ▲▲▲ */}

      {node.children.length > 0 && (
        <div>
          {node.children.map(child => (
            <CategoryItem 
              key={child.id} 
              node={child} 
              level={level + 1}
              termsByCategoryId={termsByCategoryId}
              openCategoryId={openCategoryId}
              onCategoryClick={onCategoryClick}
              openInNewTab={openInNewTab}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoryTree({ categories, termsByCategoryId }: CategoryTreeProps) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openInNewTab, setOpenInNewTab] = useState(false);

  const categoryTree = useMemo((): CategoryNode[] => {
    const categoryMap = new Map<string, CategoryNode>(
      categories.map(c => [c.id, { ...c, children: [] }])
    );
    const rootNodes: CategoryNode[] = [];

    categories.forEach(category => {
      const node = categoryMap.get(category.id);
      if (node) {
        if (category.parent && categoryMap.has(category.parent.id)) {
          categoryMap.get(category.parent.id)?.children.push(node);
        } else {
          rootNodes.push(node);
        }
      }
    });

    const sortNodes = (nodes: CategoryNode[]): CategoryNode[] => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          node.children = sortNodes(node.children);
        }
      });
      return nodes.sort((a, b) => (categoryOrder[a.id] || 9999) - (categoryOrder[b.id] || 9999));
    };

    return sortNodes(rootNodes);
  }, [categories]);

  const handleCategoryClick = (id: string) => {
    setOpenCategoryId(prevId => prevId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-end">
          <label htmlFor="open-in-new-tab-category" className="mr-3 text-sm font-medium text-gray-700">
            新しいタブで開く
          </label>
          <button
            type="button"
            id="open-in-new-tab-category"
            onClick={() => setOpenInNewTab(!openInNewTab)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              openInNewTab ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={openInNewTab}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                openInNewTab ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-4">
        {categoryTree.map(node => (
          <CategoryItem 
            key={node.id} 
            node={node} 
            level={0}
            termsByCategoryId={termsByCategoryId}
            openCategoryId={openCategoryId}
            onCategoryClick={handleCategoryClick}
            openInNewTab={openInNewTab}
          />
        ))}
      </div>
    </div>
  );
}