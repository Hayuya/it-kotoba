'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSearch() {
  const [keyword, setKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false) // ★ ローディング状態のstateを追加
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (keyword.trim() && !isSearching) {
      setIsSearching(true) // ★ 検索開始時にローディング状態にする
      router.push(`/terms?q=${encodeURIComponent(keyword.trim())}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col sm:flex-row items-center gap-3 bg-white/20 p-4 rounded-lg backdrop-blur-sm"
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="例: API, データベース..."
        className="w-full sm:flex-1 px-5 py-3 text-gray-800 rounded-md border-2 border-transparent focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all"
        aria-label="検索キーワード"
      />
      {/* ▼▼▼【変更点】ボタンにローディング表示を追加 ▼▼▼ */}
      <button
        type="submit"
        className="w-full sm:w-auto bg-white text-blue-600 font-bold px-8 py-3 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
        disabled={isSearching}
      >
        {isSearching ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            検索中...
          </>
        ) : (
          '検索する'
        )}
      </button>
      {/* ▲▲▲【変更点】▲▲▲ */}
    </form>
  )
}