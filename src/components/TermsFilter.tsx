'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useDebounce } from '../hooks/useDebounce'

interface TermsFilterProps {
  totalCount: number
}

export default function TermsFilter({ totalCount }: TermsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const selectedDifficulty = searchParams.get('difficulty') || ''
  const initialKeyword = searchParams.get('q') || ''

  const [keyword, setKeyword] = useState(initialKeyword)
  const [isSearching, setIsSearching] = useState(false)
  const debouncedKeyword = useDebounce(keyword, 500)

  useEffect(() => {
    if (debouncedKeyword === initialKeyword) {
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const params = new URLSearchParams(searchParams.toString())
    
    if (debouncedKeyword) {
      params.set('q', debouncedKeyword)
    } else {
      params.delete('q')
    }
    params.delete('page')
    
    router.push(`/terms?${params.toString()}`)
  }, [debouncedKeyword, initialKeyword, router, searchParams])

  const handleDifficultyChange = (difficulty: string) => {
    setIsSearching(true)
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
        <div className="relative">
          <input
            type="text"
            id="search-keyword"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="IT用語を入力..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
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