import { NextRequest, NextResponse } from 'next/server'
import { getTerms } from '../../../lib/microcms'

// この関数を動的にする設定
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const queries = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      orders: searchParams.get('orders') || '-publishedAt',
      q: searchParams.get('q') || undefined,
      filters: searchParams.get('filters') || undefined,
    }

    const termsResponse = await getTerms(queries)

    return NextResponse.json({
      success: true,
      data: termsResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in /api/terms:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}