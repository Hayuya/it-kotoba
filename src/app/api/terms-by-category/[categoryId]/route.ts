import { NextRequest, NextResponse } from 'next/server';
import { getTerms } from '../../../../lib/microcms';

// この関数を動的にする設定
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params;

    if (!categoryId) {
      return NextResponse.json({
        success: false,
        error: 'カテゴリーIDが必要です',
      }, { status: 400 });
    }

    // カテゴリーIDで絞り込み、必要最低限のフィールドのみ取得
    const termsResponse = await getTerms({
      limit: 100, // 1カテゴリーあたりの用語上限
      filters: `category[equals]${categoryId}`,
      fields: ['id', 'title', 'slug'],
      orders: 'order', // 表示順があれば指定
    });

    return NextResponse.json({
      success: true,
      data: termsResponse.contents,
    });

  } catch (error) {
    console.error('Error in /api/terms-by-category:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}