'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSearch() {
  const [keyword, setKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (keyword.trim() && !isSearching) {
      setIsSearching(true)
      router.push(`/terms?q=${encodeURIComponent(keyword.trim())}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      // ▼▼▼【変更点】外側の影を内側の影(shadow-inner)に変更し、背景色を調整 ▼▼▼
      className="mt-6 flex w-full items-center gap-2 rounded-xl bg-black/20 p-2 backdrop-blur-sm shadow-inner"
    >
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <svg className="h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="IT用語を入力..."
          // ▼▼▼【変更点】入力欄のスタイルを調整 ▼▼▼
          className="w-full rounded-lg border-2 border-transparent bg-transparent py-2.5 pl-11 pr-4 text-white placeholder-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/70"
          aria-label="検索キーワード"
        />
      </div>
      
      <button
        type="submit"
        // ▼▼▼【変更点】ボタンのスタイルを微調整 ▼▼▼
        className="flex h-11 items-center justify-center rounded-lg bg-white px-5 font-semibold text-blue-600 shadow-sm transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-black/20 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSearching}
      >
        {isSearching ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>検索中</span>
          </>
        ) : (
          <span>検索</span>
        )}
      </button>
    </form>
  )
}