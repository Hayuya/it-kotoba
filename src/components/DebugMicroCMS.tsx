'use client'

import { useEffect, useState } from 'react'

export default function DebugMicroCMS() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkMicroCMS = async () => {
      try {
        // 環境変数の確認
        const envInfo = {
          hasServiceDomain: !!process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
          hasApiKey: !!process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
          serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN || 'not set',
          // APIキーは最初の数文字のみ表示（セキュリティ上）
          apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY ? 
            process.env.NEXT_PUBLIC_MICROCMS_API_KEY.substring(0, 8) + '...' : 'not set'
        }

        // 直接APIを呼び出してテスト
        const testResponse = await fetch('/api/test-microcms')
        const testResult = await testResponse.json()

        setDebugInfo({
          env: envInfo,
          apiTest: testResult
        })
      } catch (error) {
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      } finally {
        setLoading(false)
      }
    }

    checkMicroCMS()
  }, [])

  if (loading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
        <p>microCMS接続をテスト中...</p>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
      <h3 className="font-bold text-red-800 mb-3">🔍 microCMS デバッグ情報</h3>
      <pre className="text-sm text-gray-700 overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}