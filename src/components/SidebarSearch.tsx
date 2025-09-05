// src/components/SidebarSearch.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function SidebarSearch() {
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
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">検索</h3>
        <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2"
        >
        <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            </div>
            <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="IT用語を検索..."
            className="w-full rounded-lg border-gray-300 border py-2 pl-10 pr-4 text-gray-700 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="検索キーワード"
            />
        </div>
        
        <button
            type="submit"
            className="flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 font-semibold text-white shadow-sm transition-transform duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSearching}
        >
            {isSearching ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ) : (
            <span>検索</span>
            )}
        </button>
        </form>
  </div>
  )
}