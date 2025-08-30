'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSearch() {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (keyword.trim()) {
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
      <button
        type="submit"
        className="w-full sm:w-auto bg-white text-blue-600 font-bold px-8 py-3 rounded-md hover:bg-blue-50 transition-colors"
      >
        検索する
      </button>
    </form>
  )
}