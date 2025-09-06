// src/app/api/sitemap/route.ts

import { NextResponse } from 'next/server'
import { getAllTermSlugs } from '../../../lib/microcms'

// この関数を動的にする設定
export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // 静的ページのURLリストを更新
  const staticUrls = [
    { url: `${baseUrl}/`, priority: 1.0 },
    { url: `${baseUrl}/terms`, priority: 0.9 },
    { url: `${baseUrl}/super-index`, priority: 0.9 },
    { url: `${baseUrl}/about`, priority: 0.7 },
    { url: `${baseUrl}/contact`, priority: 0.5 },
  ]

  // microCMSから動的ページのURLを取得
  const termSlugs = await getAllTermSlugs();

  // 各用語ページ
  const termUrls = termSlugs.map(slug => ({
    url: `${baseUrl}/terms/${slug}`,
    priority: 0.8,
  }))

  // 全てのURLを結合
  const allUrls = [...staticUrls, ...termUrls]

  // XMLサイトマップの生成
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(({ url, priority }) => {
      return `
    <url>
      <loc>${url}</loc>
      <priority>${priority}</priority>
      <changefreq>daily</changefreq>
    </url>
  `
    })
    .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}