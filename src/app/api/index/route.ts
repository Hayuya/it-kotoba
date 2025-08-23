import { NextRequest, NextResponse } from 'next/server'
import { getTerms } from '../../../lib/microcms'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const indexType = searchParams.get('type') // 'alphabet', 'number'
    const indexChar = searchParams.get('char') // 'A', '0-9' など

    if (!indexType || !indexChar) {
      return NextResponse.json({
        success: false,
        error: 'type と char パラメータが必要です',
      }, { status: 400 })
    }

    let filters: string[] = []

    switch (indexType) {
      

      case 'alphabet':
        // アルファベット索引の場合
        filters = [`title[begins_with]${indexChar.toUpperCase()}`]
        break

      case 'number':
        // 数字索引の場合
        const numberConditions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
          .map(num => `title[begins_with]${num}`)
        filters = [numberConditions.join('[or]')]
        break

      default:
        return NextResponse.json({
          success: false,
          error: '無効な索引タイプです',
        }, { status: 400 })
    }

    const termsResponse = await getTerms({
      limit: 50,
      offset: 0,
      orders: 'title',
      filters: filters.join('[and]')
    })

    return NextResponse.json({
      success: true,
      data: termsResponse,
      indexType,
      indexChar,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in /api/index:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}