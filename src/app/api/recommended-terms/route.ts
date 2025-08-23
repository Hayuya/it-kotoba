import { NextRequest, NextResponse } from 'next/server'
import { getRecommendedTerms } from '../../../lib/microcms'

// この関数を動的にする設定
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 6

    console.log('おすすめ用語取得開始:', limit, '件')

    const recommendedTerms = await getRecommendedTerms(limit)

    console.log('おすすめ用語取得完了:', recommendedTerms.length, '件')

    return NextResponse.json({
      success: true,
      data: {
        contents: recommendedTerms,
        totalCount: recommendedTerms.length
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in /api/recommended-terms:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}