'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRecommendedTerms, Term, getDifficultyColor, getDifficultyLabel } from '../lib/microcms'

export default function RecommendedSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [recommendedTerms, setRecommendedTerms] = useState<Term[]>([])
  const [loading, setLoading] = useState(true)

  // おすすめ用語を取得
  useEffect(() => {
    const fetchRecommendedTerms = async () => {
      try {
        const terms = await getRecommendedTerms(6)
        setRecommendedTerms(terms)
      } catch (error) {
        console.error('Error fetching recommended terms:', error)
        // エラー時はサンプルデータを表示
        setRecommendedTerms([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedTerms()
  }, [])

  // 自動スライド機能
  useEffect(() => {
    if (!isAutoPlay || recommendedTerms.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(recommendedTerms.length / 2))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, recommendedTerms.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(recommendedTerms.length / 2))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(recommendedTerms.length / 2)) % Math.ceil(recommendedTerms.length / 2))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">おすすめ用語を読み込み中...</p>
      </div>
    )
  }

  if (recommendedTerms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">おすすめ用語がまだ登録されていません。</p>
        <Link 
          href="/terms" 
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
        >
          すべての用語を見る →
        </Link>
      </div>
    )
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* スライダーコンテナ */}
      <div className="overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(recommendedTerms.length / 2) }).map((_, slideIndex) => (
            <div key={slideIndex} className="min-w-full">
              <div className="grid md:grid-cols-2 gap-6">
                {recommendedTerms
                  .slice(slideIndex * 2, slideIndex * 2 + 2)
                  .map((term) => (
                    <Link
                      key={term.id}
                      href={`/terms/${term.slug}`}
                      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{term.category.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {term.title}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(term.difficulty)}`}>
                              {getDifficultyLabel(term.difficulty)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {term.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {term.category.name}
                            </span>
                            <span className="text-blue-600 text-sm font-medium group-hover:text-blue-800">
                              詳細を見る →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      {recommendedTerms.length > 2 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600 rounded-full p-2 shadow-md transition-all"
            aria-label="前のスライド"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600 rounded-full p-2 shadow-md transition-all"
            aria-label="次のスライド"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* インジケーター */}
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: Math.ceil(recommendedTerms.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`スライド ${index + 1}に移動`}
              />
            ))}
          </div>

          {/* 自動再生コントロール */}
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isAutoPlay ? '⏸️ 自動再生を停止' : '▶️ 自動再生を開始'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}