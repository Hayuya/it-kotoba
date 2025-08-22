'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const categories = [
    {
      id: 'crypto',
      name: '暗号・認証',
      icon: '🔐',
      subcategories: [
        { id: 'symmetric-crypto', name: '共通鍵暗号' },
        { id: 'asymmetric-crypto', name: '公開鍵暗号' },
        { id: 'hash', name: 'ハッシュ関数' },
        { id: 'digital-signature', name: 'デジタル署名' },
        { id: 'authentication', name: '認証技術' },
        { id: 'pki', name: 'PKI' }
      ]
    },
    {
      id: 'threats',
      name: '脅威・攻撃',
      icon: '🛡️',
      subcategories: [
        { id: 'malware', name: 'マルウェア' },
        { id: 'network-attack', name: 'ネットワーク攻撃' },
        { id: 'web-attack', name: 'Web攻撃' },
        { id: 'social-engineering', name: 'ソーシャルエンジニアリング' },
        { id: 'vulnerability', name: '脆弱性' }
      ]
    },
    {
      id: 'network',
      name: 'ネットワーク',
      icon: '🌐',
      subcategories: [
        { id: 'tcp-ip', name: 'TCP/IP' },
        { id: 'firewall', name: 'ファイアウォール' },
        { id: 'vpn', name: 'VPN' },
        { id: 'ids-ips', name: 'IDS/IPS' },
        { id: 'wireless', name: '無線LAN' }
      ]
    },
    {
      id: 'legal',
      name: '法律・制度',
      icon: '📋',
      subcategories: [
        { id: 'privacy-law', name: '個人情報保護法' },
        { id: 'cyber-law', name: 'サイバーセキュリティ基本法' },
        { id: 'computer-fraud', name: '不正アクセス禁止法' },
        { id: 'international-law', name: '国際法・条約' }
      ]
    },
    {
      id: 'management',
      name: '組織・管理',
      icon: '🏢',
      subcategories: [
        { id: 'isms', name: 'ISMS' },
        { id: 'risk-management', name: 'リスク管理' },
        { id: 'incident-response', name: 'インシデント対応' },
        { id: 'bcp', name: 'BCP/DR' },
        { id: 'audit', name: '監査' }
      ]
    },
    {
      id: 'systems',
      name: 'システム',
      icon: '💻',
      subcategories: [
        { id: 'os-security', name: 'OS セキュリティ' },
        { id: 'database', name: 'データベース' },
        { id: 'web-app', name: 'Webアプリケーション' },
        { id: 'cloud', name: 'クラウド' },
        { id: 'mobile', name: 'モバイル' }
      ]
    }
  ]

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 検索機能の実装（実際の検索ページにリダイレクト）
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="space-y-6">
      {/* サイト内検索 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">サイト内検索</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="用語を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* カリキュラムもくじ */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">カリキュラムもくじ</h3>
        <nav className="space-y-2">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-700">{category.name}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    expandedCategories.includes(category.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedCategories.includes(category.id) && (
                <div className="ml-6 mt-2 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/category/${category.id}/${subcategory.id}`}
                      className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 解説者プロフィール */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">解説者プロフィール</h3>
        <div className="flex items-start space-x-4">
          <img
            src="/images/profile.jpg"
            alt="解説者プロフィール"
            className="w-16 h-16 rounded-full bg-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl hidden">
            IT
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">セキュリティ専門家</h4>
            <p className="text-sm text-gray-600 mb-3">
              情報処理安全確保支援士（登録セキスペ）として10年以上の実務経験。
              企業のセキュリティ対策や人材育成に従事。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                情報処理安全確保支援士
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                CISSP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 学習のヒント */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
        <h3 className="text-lg font-semibold mb-3 text-orange-800">📝 学習のヒント</h3>
        <ul className="text-sm text-orange-700 space-y-2">
          <li>• まずは基本用語から学習しましょう</li>
          <li>• 関連用語を合わせて覚えると効果的</li>
          <li>• 実際の事例と結び付けて理解しましょう</li>
          <li>• 定期的な復習で記憶を定着させましょう</li>
        </ul>
      </div>
    </div>
  )
}