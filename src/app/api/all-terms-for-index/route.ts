import { NextResponse } from 'next/server'
import { getAllSearchableTerms } from '../../../lib/microcms'

// このAPIルートを動的にする設定
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // lib/microcms.tsのページネーション対応関数を呼び出す
    const terms = await getAllSearchableTerms();
    
    return NextResponse.json({
      success: true,
      data: terms,
    });

  } catch (error) {
    console.error('Error in /api/all-terms-for-index:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}