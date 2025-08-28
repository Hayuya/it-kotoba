'use client'

// ▼▼▼【変更点】useMemo をインポート ▼▼▼
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Category } from '../lib/microcms'

interface IndexSidebarProps {
  categories?: Category[]
}

const ALPHABET_GROUPS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

const NUMBER_GROUP = '0-9'

export default function IndexSidebar({ categories = [] }: IndexSidebarProps) {
  const [selectedIndex, setSelectedIndex] = useState<string>('')
  const [indexType, setIndexType] = useState<'alphabet' | 'number'>('alphabet')
  const [indexTerms, setIndexTerms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  // ▼▼▼【変更点】絞り込み検索用のstateを追加 ▼▼▼
  const [filterQuery, setFilterQuery] = useState('')

  // 索引で用語を取得
  const fetchIndexTerms = async (index: string, type: 'alphabet' | 'number') => {
    if (!index) {
      setIndexTerms([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/index?type=${type}&char=${encodeURIComponent(index)}`)
      
      if (response.ok) {
        const data = await response.json()
        setIndexTerms(data.success ? data.data.contents : [])
      } else {
        setIndexTerms([])
      }
    } catch (error) {
      console.error('Error fetching index terms:', error)
      setIndexTerms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIndexTerms(selectedIndex, indexType)
  }, [selectedIndex, indexType])

  // 索引タイプ切り替え
  const handleIndexTypeChange = (type: 'alphabet' | 'number') => {
    setIndexType(type)
    setSelectedIndex('')
    setIndexTerms([])
    // ▼▼▼【変更点】検索キーワードをリセット ▼▼▼
    setFilterQuery('')
  }

  // 索引項目をクリック
  const handleIndexClick = (index: string) => {
    // ▼▼▼【変更点】検索キーワードをリセット ▼▼▼
    setFilterQuery('')
    if (selectedIndex === index) {
      setSelectedIndex('')
    } else {
      setSelectedIndex(index)
    }
  }
  
  // ▼▼▼【変更点】絞り込み後の用語リストをメモ化して作成 ▼▼▼
  const filteredTerms = useMemo(() => {
    if (!filterQuery) {
      return indexTerms;
    }
    return indexTerms.filter(term =>
      term.title.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [indexTerms, filterQuery]);


  return (
    <div className="sticky top-24 space-y-6 max-h-[calc(100vh-7.5rem)] overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🔍 索引</h3>
        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => handleIndexTypeChange('alphabet')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              indexType === 'alphabet'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ABC
          </button>
          <button
            onClick={() => handleIndexTypeChange('number')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              indexType === 'number'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            数字
          </button>
        </div>

        <div className="mb-4">
          {indexType === 'alphabet' && (
            <div className="grid grid-cols-6 gap-1">
              {ALPHABET_GROUPS.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleIndexClick(letter)}
                  className={`p-2 text-center text-sm rounded transition-colors ${
                    selectedIndex === letter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}

          {indexType === 'number' && (
            <div className="flex justify-center">
              <button
                onClick={() => handleIndexClick(NUMBER_GROUP)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedIndex === NUMBER_GROUP
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                0-9
              </button>
            </div>
          )}
        </div>

        {selectedIndex && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              「{selectedIndex}」で始まる用語 
              {indexTerms.length > 0 && `(${indexTerms.length}件)`}
            </h4>
            
            {/* ▼▼▼【変更点】検索ボックスを追加 ▼▼▼ */}
            {indexTerms.length > 0 && (
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="リスト内を検索..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">読み込み中...</p>
              </div>
            // ▼▼▼【変更点】filteredTerms を使用して描画 ▼▼▼
            ) : filteredTerms.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredTerms.map((term) => (
                  <Link
                    key={term.id}
                    href={`/terms/${term.slug}`}
                    className="block p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span className="font-medium">{term.title}</span>
                    {term.category && (
                      <span className="ml-2 text-xs text-gray-500">
                        [{term.category.name}]
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">
                {/* 絞り込み結果がない場合と、元々用語がない場合でメッセージを分岐 */}
                {indexTerms.length > 0 ? '該当する用語がありません' : '該当する用語が見つかりませんでした'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}