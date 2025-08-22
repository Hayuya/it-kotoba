'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecommendedTerm {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  slug: string
}

export default function RecommendedSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // サンプルデータ（実際にはmicroCMSから取得）
  const recommendedTerms: RecommendedTerm[] = [
    {
      id: '1',
      title: 'ゼロトラスト',
      description: '従来の境界防御に頼らない新しいセキュリティモデル。「信頼しない、常に検証する」が基本原則。',
      category: '組織・管理',
      difficulty: 'intermediate',
      icon: '🛡️',
      slug: 'zero-trust'
    },
    {
      id: '2',
      title: 'CSRF（Cross-Site Request Forgery）',
      description: 'Webアプリケーションの脆弱性の一つ。ユーザーの意図しない操作を実行させる攻撃手法。',
      category: '脅威・攻撃',
      difficulty: 'intermediate',
      icon: '🌐',
      slug: 'csrf'
    },
    {
      id: '3',
      title: 'AES（Advanced Encryption Standard）',
      description: 'アメリカ政府標準の共通鍵暗号アルゴリズム。128/192/256ビットの鍵長をサポート。',
      category: '暗号・認証',
      difficulty: 'beginner',
      icon: '🔐',
      slug: 'aes'
    },
    {
      id: '4',
      title: 'SIEM（Security Information and Event Management）',
      description: 'セキュリティ情報とイベントを統合管理するシステム。リアルタイム分析と脅威検知を実現。',
      category: 'システム',
      difficulty: 'advanced',
      icon: '📊',
      slug: 'siem'
    },
    {
      id: '5',
      title: 'PKI（Public Key Infrastructure）',
      description: '公開鍵暗号を利用した認証基盤。デジタル証明書の発行・管理・検証を行う。',
      category: '暗号・認証',
      difficulty: 'intermediate',
      icon: '🗝️',
      slug: 'pki'
    },
    {
      id: '6',
      title: 'SOC（Security Operations Center）',
      description: 'セキュリティ監視を24時間365日行う組織・施設。インシデントの検知と対応を担う。',
      category: '組織・管理',
      difficulty: 'intermediate',
      icon: '🏢',
      slug: 'soc'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初級'
      case 'intermediate':
        return '中級'
      case 'advanced':
        return '上級'
      default:
        return '不明'
    }
  }

  // 自動スライド機能
  useEffect(() => {
    if (!isAutoPlay) return

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
                        <div className="text-3xl">{term.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {term.title}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(term.difficulty)}`}>
                              {getDifficultyText(term.difficulty)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {term.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {term.category}
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
    </div>
  )
}