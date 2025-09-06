'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Term, getDifficultyColor, getDifficultyLabel } from '../lib/microcms'

export default function RecommendedSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [recommendedTerms, setRecommendedTerms] = useState<Term[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // おすすめ記事を取得
  const fetchRecommendedTerms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('おすすめ記事を取得中...')
      
      const response = await fetch('/api/recommended-terms?limit=6')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('APIレスポンス:', data)
      
      if (data.success && data.data && data.data.contents) {
        setRecommendedTerms(data.data.contents)
        console.log('おすすめ記事を設定しました:', data.data.contents.length, '件')
      } else {
        throw new Error('APIレスポンスの形式が正しくありません')
      }
    } catch (error) {
      console.error('Error fetching recommended terms:', error)
      setError('おすすめ記事の取得に失敗しました')
      
      // エラー時はフォールバック用の最新記事を取得
      try {
        console.log('フォールバックとして最新記事を取得中...')
        const fallbackResponse = await fetch('/api/terms?limit=6&orders=-publishedAt')
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          if (fallbackData.success && fallbackData.data && fallbackData.data.contents) {
            setRecommendedTerms(fallbackData.data.contents)
            setError(null) // エラーをクリア
            console.log('フォールバック記事を設定しました:', fallbackData.data.contents.length, '件')
          }
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecommendedTerms()
  }, [fetchRecommendedTerms])

  // 自動スライド機能
  useEffect(() => {
    if (!isAutoPlay || recommendedTerms.length === 0) return

    const totalSlides = Math.ceil(recommendedTerms.length / 2)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, recommendedTerms.length])

  const nextSlide = useCallback(() => {
    const totalSlides = Math.ceil(recommendedTerms.length / 2)
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [recommendedTerms.length])

  const prevSlide = useCallback(() => {
    const totalSlides = Math.ceil(recommendedTerms.length / 2)
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [recommendedTerms.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">記事を読み込み中...</p>
        </div>
        
        {/* スケルトンローダー */}
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="space-y-2 mb-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && recommendedTerms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">読み込みエラー</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={fetchRecommendedTerms}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          再読み込み
        </button>
      </div>
    )
  }

  if (recommendedTerms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">記事がありません</h3>
        <p className="text-gray-600 mb-6">
          おすすめ記事がまだ登録されていません。
        </p>
        <Link 
          href="/terms" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          すべての用語を見る →
        </Link>
      </div>
    )
  }

  const totalSlides = Math.ceil(recommendedTerms.length / 2)

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
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {term.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${getDifficultyColor(term.difficulty)}`}>
                            {getDifficultyLabel(term.difficulty)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {term.description}
                        </p>
                        <div className="flex items-center justify-end">
                          <span className="text-blue-600 text-sm font-medium group-hover:text-blue-800">
                            詳細を見る →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                
                {/* 奇数個の場合の空白スペース */}
                {recommendedTerms.slice(slideIndex * 2, slideIndex * 2 + 2).length === 1 && (
                  <div className="hidden md:block"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ナビゲーションボタン（複数スライドがある場合のみ表示） */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 rounded-full p-2 shadow-lg transition-all"
            aria-label="前のスライド"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 rounded-full p-2 shadow-lg transition-all"
            aria-label="次のスライド"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* インジケーター */}
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
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
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
            >
            </button>
          </div>
        </>
      )}
    </div>
  )
}