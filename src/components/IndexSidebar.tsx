'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Category } from '../lib/microcms'

interface IndexSidebarProps {
  categories?: Category[]
}

// アルファベットのグループ
const ALPHABET_GROUPS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

// 数字グループ
const NUMBER_GROUP = '0-9'

export default function IndexSidebar({ categories = [] }: IndexSidebarProps) {
  const [selectedIndex, setSelectedIndex] = useState<string>('')
  const [indexType, setIndexType] = useState<'alphabet' | 'number'>('alphabet')
  const [indexTerms, setIndexTerms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 索引で用語を取得
  const fetchIndexTerms = async (index: string, type: 'alphabet' | 'number') => {
    if (!index) {
      setIndexTerms([])
      return
    }

    setLoading(true)
    try {
      let filter = ''
      
      if (type === 'alphabet') {
        // アルファベット索引の場合
        filter = `title[begins_with]${index}`
      } else if (type === 'number') {
        // 数字索引の場合
        const numberConditions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
          .map(num => `title[begins_with]${num}`).join('[or]')
        filter = numberConditions
      }

      const response = await fetch(`/api/terms?filters=${encodeURIComponent(filter)}&limit=50&orders=title`)
      
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

  // 索引が変更された時の処理
  useEffect(() => {
    fetchIndexTerms(selectedIndex, indexType)
  }, [selectedIndex, indexType])

  // 索引タイプ切り替え
  const handleIndexTypeChange = (type: 'alphabet' | 'number') => {
    setIndexType(type)
    setSelectedIndex('')
    setIndexTerms([])
  }

  // 索引項目をクリック
  const handleIndexClick = (index: string) => {
    if (selectedIndex === index) {
      setSelectedIndex('')
    } else {
      setSelectedIndex(index)
    }
  }

  return (
    // 追従するように変更
    <div className="sticky top-24 space-y-6 max-h-[calc(100vh-7.5rem)] overflow-y-auto">
      {/* ABC・数字索引 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🔍 索引</h3>
        
        {/* 索引タイプ選択 */}
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

        {/* 索引項目 */}
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

        {/* 索引結果 */}
        {selectedIndex && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              「{selectedIndex}」で始まる用語 
              {indexTerms.length > 0 && `(${indexTerms.length}件)`}
            </h4>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">読み込み中...</p>
              </div>
            ) : indexTerms.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {indexTerms.map((term) => (
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
                該当する用語が見つかりませんでした
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}