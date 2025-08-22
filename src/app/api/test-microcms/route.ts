import { NextResponse } from 'next/server'
import { client } from '../../../lib/microcms'

export async function GET() {
  try {
    console.log('=== microCMS接続テスト開始 ===')
    
    // 環境変数の確認
    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    const apiKey = process.env.MICROCMS_API_KEY
    
    console.log('Service Domain:', serviceDomain || 'NOT SET')
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET')
    
    if (!serviceDomain || !apiKey) {
      return NextResponse.json({
        success: false,
        error: '環境変数が設定されていません',
        serviceDomain: !!serviceDomain,
        apiKey: !!apiKey
      })
    }

    // カテゴリー取得テスト
    console.log('カテゴリー取得を試行中...')
    const categoriesResponse = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 10
      }
    })
    
    console.log('カテゴリー取得成功:', categoriesResponse)

    // 用語取得テスト
    console.log('用語取得を試行中...')
    const termsResponse = await client.get({
      endpoint: 'terms',
      queries: {
        limit: 5
      }
    })
    
    console.log('用語取得成功:', termsResponse)

    return NextResponse.json({
      success: true,
      data: {
        categories: {
          count: categoriesResponse.totalCount,
          items: categoriesResponse.contents
        },
        terms: {
          count: termsResponse.totalCount,
          items: termsResponse.contents
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('microCMS接続エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}