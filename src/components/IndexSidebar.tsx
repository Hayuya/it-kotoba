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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [indexTerms, setIndexTerms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

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
    <div className="space-y-6">
      {/* ABC・数字索引 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">📚 用語索引</h3>
        
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
      
        {/* 全カテゴリー表示ボタン */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href="/categories"
            className="block w-full text-center py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            すべてのカテゴリーを見る
          </Link>
        </div>
      </div>

      {/* 解説者プロフィール */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">解説者プロフィール</h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            🐟〜
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">匿名200</h4>
            <p className="text-sm text-gray-600 mb-3">
              データ解析とWebアプリケーションの専門家。
              企業のセキュリティ対策に従事。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                システムエンジニア
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                CISSP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 学習のヒント */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
        <h3 className="text-lg font-semibold mb-3 text-orange-800">📝 学習のヒント</h3>
        <ul className="text-sm text-orange-700 space-y-2">
          <li>• まずは基本用語から学習しましょう</li>
          <li>• 関連用語を合わせて覚えると効果的</li>
          <li>• 実際の事例と結び付けて理解しましょう</li>
          <li>• 定期的な復習で記憶を定着させましょう</li>
        </ul>
      </div>
    </div>
  )
}