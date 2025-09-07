import { MetadataRoute } from 'next'
import { getAllTermsForSitemap } from '@/lib/microcms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // 静的ページのURLリスト
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/super-index`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5, changeFrequency: 'yearly' },
    { url: `${baseUrl}/recommended`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/commands`, lastModified: new Date(), priority: 0.6, changeFrequency: 'monthly' },
  ]

  // microCMSから動的な記事（用語）の情報を取得
  const terms = await getAllTermsForSitemap()
  const termRoutes: MetadataRoute.Sitemap = terms.map((term) => ({
    url: `${baseUrl}/terms/${term.slug}`,
    lastModified: new Date(term.updatedAt),
    priority: 0.8,
    changeFrequency: 'daily',
  }))

  return [...staticRoutes, ...termRoutes]
}