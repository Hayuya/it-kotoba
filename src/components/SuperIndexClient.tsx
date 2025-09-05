'use client'

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Term } from '../lib/microcms';

// 必要なプロパティだけを型として定義
type IndexTerm = Pick<Term, 'id' | 'title' | 'slug'>;

interface SuperIndexClientProps {
  allTerms: IndexTerm[];
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0-9';

export default function SuperIndexClient({ allTerms }: SuperIndexClientProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  // ▼▼▼ ここから追加 ▼▼▼
  const [openInNewTab, setOpenInNewTab] = useState(true); // 新しいタブで開くかの状態
  // ▲▲▲ ここまで追加 ▲▲▲

  const groupedAndSortedTerms = useMemo(() => {
    const groups: { [key: string]: IndexTerm[] } = {};

    [...ALPHABET, NUMBERS].forEach(key => {
      groups[key] = [];
    });

    allTerms.forEach(term => {
      const firstChar = term.title.trim().toUpperCase().charAt(0);
      if (/[A-Z]/.test(firstChar)) {
        groups[firstChar].push(term);
      } else if (/[0-9]/.test(firstChar)) {
        groups[NUMBERS].push(term);
      }
    });

    for (const key in groups) {
      groups[key].sort((a, b) => {
        return a.title.substring(1).localeCompare(b.title.substring(1), 'ja');
      });
    }

    return groups;
  }, [allTerms]);

  const handleToggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* ▼▼▼ ここから追加 ▼▼▼ */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-end">
          <label htmlFor="open-in-new-tab" className="mr-3 text-sm font-medium text-gray-700">
            新しいタブで開く
          </label>
          <button
            type="button"
            id="open-in-new-tab"
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
      {/* ▲▲▲ ここまで追加 ▲▲▲ */}

      <div className="space-y-1">
        {[...ALPHABET, NUMBERS].map(key => {
          const terms = groupedAndSortedTerms[key];
          if (terms.length === 0) return null;

          const isOpen = openSection === key;

          return (
            <div key={key} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => handleToggleSection(key)}
                className="w-full flex justify-between items-center py-5 px-6 text-left text-xl font-bold text-gray-800 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                aria-expanded={isOpen}
              >
                <span>{key} <span className="text-sm font-normal text-gray-500">({terms.length}件)</span></span>
                <svg
                  className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="bg-gray-50 py-4 px-6 border-t border-gray-200">
                  <ul className="columns-1 sm:columns-2 lg:columns-3 gap-x-8">
                    {terms.map(term => (
                      <li key={term.id} className="mb-2 break-inside-avoid">
                        <Link
                          href={`/terms/${term.slug}`}
                          // ▼▼▼ ここから変更 ▼▼▼
                          target={openInNewTab ? '_blank' : '_self'}
                          rel={openInNewTab ? 'noopener noreferrer' : ''}
                          // ▲▲▲ ここまで変更 ▲▲▲
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                        >
                          {term.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}