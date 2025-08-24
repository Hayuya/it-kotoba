import { NextRequest, NextResponse } from 'next/server'
import { getTerms, Term } from '../../../lib/microcms'

// この関数を動的にする設定
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
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
        // アルファベット索引の場合（大文字と小文字を両方対象にする）
        const lowerChar = indexChar.toLowerCase()
        const upperChar = indexChar.toUpperCase()
        filters = [`title[begins_with]${upperChar}[or]title[begins_with]${lowerChar}`]
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
      limit: 100, // 取得件数を増やしてソートに備える
      offset: 0,
      filters: filters.join('[and]')
    })

    // 2文字目以降でソート
    const sortedContents = termsResponse.contents.sort((a: Term, b: Term) => {
      const titleA = a.title.substring(1)
      const titleB = b.title.substring(1)
      return titleA.localeCompare(titleB, 'ja')
    })
    
    // ソート後の結果をセット
    termsResponse.contents = sortedContents

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