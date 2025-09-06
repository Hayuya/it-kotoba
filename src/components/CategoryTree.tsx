'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CategoryNode } from '../lib/categoryTree';

interface CategoryTreeProps {
  categoryTree: CategoryNode[];
}

export default function CategoryTree({ categoryTree }: CategoryTreeProps) {
  const [openGrandchildId, setOpenGrandchildId] = useState<string | null>(null);

  const handleToggle = (grandchildId: string) => {
    setOpenGrandchildId(prevId => (prevId === grandchildId ? null : grandchildId));
  };

  if (!categoryTree || categoryTree.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        カテゴリーが登録されていません。
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {categoryTree.map((parent) => (
        <div key={parent.id} className="border-b border-gray-200 last:border-b-0 p-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            <span className="text-2xl mr-3">{parent.icon}</span>
            {parent.name}
          </h3>
          <div className="space-y-4">
            {parent.children.map((child) => (
              <div key={child.id} className="pl-4 border-l-2 border-gray-200">
                <h4 className="font-semibold text-gray-700">{child.name}</h4>
                <div className="pl-6 pt-2 space-y-2">
                  {child.children.map((grandchild) => (
                    <div key={grandchild.id}>
                      <button
                        onClick={() => handleToggle(grandchild.id)}
                        className="w-full text-left text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        aria-expanded={openGrandchildId === grandchild.id}
                      >
                        {grandchild.name} ({grandchild.terms.length}件)
                      </button>
                      {openGrandchildId === grandchild.id && (
                        <ul className="mt-2 pl-4 border-l border-dashed border-gray-300 space-y-1 max-h-60 overflow-y-auto">
                          {grandchild.terms.length > 0 ? (
                            grandchild.terms.map((term) => (
                              <li key={term.id}>
                                <Link
                                  href={`/terms/${term.slug}`}
                                  className="block text-sm text-gray-600 hover:text-black py-1"
                                >
                                  {term.title}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-gray-400 py-1 italic">
                              用語がありません
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}