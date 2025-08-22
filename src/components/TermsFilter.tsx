'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '../lib/microcms'

interface TermsFilterProps {
  categories: Category[]
  totalCount: number
}

export default function TermsFilter({ categories, totalCount }: TermsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const selectedCategory = searchParams.get('category') || ''
  const selectedDifficulty = searchParams.get('difficulty') || ''

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
      {/* フィルター */}
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