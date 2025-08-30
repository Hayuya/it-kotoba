'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '../lib/microcms'
import { useState, useEffect } from 'react'
import { useDebounce } from '../hooks/useDebounce'

interface TermsFilterProps {
  categories: Category[]
  totalCount: number
}

export default function TermsFilter({ categories, totalCount }: TermsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const selectedCategory = searchParams.get('category') || ''
  const selectedDifficulty = searchParams.get('difficulty') || ''
  const initialKeyword = searchParams.get('q') || ''

  const [keyword, setKeyword] = useState(initialKeyword)
  const debouncedKeyword = useDebounce(keyword, 500)

  // ▼▼▼【変更点】useEffectのロジックを最終版に更新 ▼▼▼
  useEffect(() => {
    // 最初のレンダリング時や、URLのキーワードと入力が同じ場合は実行しない
    if (debouncedKeyword === initialKeyword) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    
    if (debouncedKeyword) {
      params.set('q', debouncedKeyword)
    } else {
      params.delete('q')
    }
    params.delete('page') // 検索時は1ページ目に戻す
    
    // 依存配列を修正し、意図しない再実行を防ぐ
    router.push(`/terms?${params.toString()}`)
  }, [debouncedKeyword, initialKeyword, router, searchParams])
  // ▲▲▲【変更点】▲▲▲

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`/terms?${params.toString()}`)
  }

  const handleDifficultyChange = (difficulty: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (difficulty) {
      params.set('difficulty', difficulty)
    } else {
      params.delete('difficulty')
    }
    params.delete('page')
    router.push(`/terms?${params.toString()}`)
  }

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="search-keyword" className="block text-sm font-medium text-gray-700 mb-2">キーワード検索</label>
        <input
          type="text"
          id="search-keyword"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="IT用語を入力..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {/* ▼▼▼【変更点】注釈を削除 ▼▼▼ */}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリー</label>
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">すべて</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">難易度</label>
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={selectedDifficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
          >
            <option value="">すべて</option>
            <option value="beginner">初級</option>
            <option value="intermediate">中級</option>
            <option value="advanced">上級</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          📊 <strong>{totalCount}個</strong> の用語が見つかりました
        </p>
      </div>
    </div>
  )
}