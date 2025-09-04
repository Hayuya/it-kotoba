import { NextResponse } from 'next/server'
import { getAllTermsForIndex } from '../../../lib/microcms'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const terms = await getAllTermsForIndex();
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