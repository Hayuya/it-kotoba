import { NextResponse } from 'next/server'
import { client } from '../../../lib/microcms'

// この関数を動的にする設定
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('=== カテゴリーデバッグ開始 ===')
    
    // 環境変数の確認
    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    const apiKey = process.env.MICROCMS_API_KEY
    
    console.log('Service Domain:', serviceDomain || 'NOT SET')
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET')
    
    if (!serviceDomain || !apiKey) {
      return NextResponse.json({
        success: false,
        error: '環境変数が設定されていません',
        debug: {
          hasServiceDomain: !!serviceDomain,
          hasApiKey: !!apiKey
        }
      })
    }

    // 全カテゴリーを取得（フィルターなし）
    console.log('全カテゴリー取得を試行中...')
    const allCategoriesResponse = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100
      }
    })
    
    console.log('全カテゴリー取得成功:', allCategoriesResponse.totalCount, '件')

    // 順序付きカテゴリーを取得
    console.log('順序付きカテゴリー取得を試行中...')
    const orderedCategoriesResponse = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order'
      }
    })
    
    console.log('順序付きカテゴリー取得成功:', orderedCategoriesResponse.totalCount, '件')

    // 公開済みカテゴリーのみを取得
    console.log('公開済みカテゴリー取得を試行中...')
    const publishedCategoriesResponse = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
        filters: 'publishedAt[exists]'
      }
    })
    
    console.log('公開済みカテゴリー取得成功:', publishedCategoriesResponse.totalCount, '件')

    return NextResponse.json({
      success: true,
      debug: {
        environment: {
          serviceDomain: serviceDomain,
          hasApiKey: !!apiKey
        },
        allCategories: {
          count: allCategoriesResponse.totalCount,
          items: allCategoriesResponse.contents.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            order: cat.order,
            publishedAt: cat.publishedAt,
            hasParent: !!cat.parent
          }))
        },
        orderedCategories: {
          count: orderedCategoriesResponse.totalCount,
          items: orderedCategoriesResponse.contents.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            order: cat.order
          }))
        },
        publishedCategories: {
          count: publishedCategoriesResponse.totalCount,
          items: publishedCategoriesResponse.contents.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            order: cat.order
          }))
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('カテゴリーデバッグエラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
  }
}