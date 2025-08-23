'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTermsClient, Term, getDifficultyColor, getDifficultyLabel, formatDate } from '../lib/microcms'

export default function LatestArticles() {
  const [latestTerms, setLatestTerms] = useState<Term[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestTerms = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const termsResponse = await getTermsClient({
          limit: 6,
          orders: '-publishedAt'
        })
        
        setLatestTerms(termsResponse.contents)
      } catch (error) {
        console.error('Error fetching latest terms:', error)
        setError('新着記事の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchLatestTerms()
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded-full w-12"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">エラーが発生しました</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          再読み込み
        </button>
      </div>
    )
  }

  if (latestTerms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">記事がまだありません</h3>
        <p className="text-gray-600 mb-6">
          新しい記事が追加されるまでしばらくお待ちください。
        </p>
        <Link 
          href="/categories"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          カテゴリーを見る
        </Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {latestTerms.map((term) => (
        <Link
          key={term.id}
          href={`/terms/${term.slug}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
        >
          {/* ヘッダー */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {term.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${getDifficultyColor(term.difficulty)}`}>
              {getDifficultyLabel(term.difficulty)}
            </span>
          </div>

          {/* 概要 */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {term.description}
          </p>

          {/* フッター */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{term.category.icon}</span>
              <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {term.category.name}
              </span>
            </div>
            <span className="text-gray-500">
              {formatDate(term.publishedAt)}
            </span>
          </div>

          {/* ホバー効果 */}
          <div className="mt-3 text-blue-600 text-sm font-medium group-hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-all">
            詳細を読む →
          </div>
        </Link>
      ))}
    </div>
  )
}