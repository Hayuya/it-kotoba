import fs from 'fs';
import { getAllTermSlugs } from '../src/lib/microcms.js';

// .envファイルから環境変数を読み込むための暫定対応
// Vercel環境では不要だが、ローカルビルドのために追記
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


async function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  console.log('Sitemap generation started...');

  // 1. 静的ページのURLリスト
  const staticPages = [
    { url: `${baseUrl}/`, priority: 1.0, changefreq: 'daily' },
    { url: `${baseUrl}/terms`, priority: 0.9, changefreq: 'weekly' },
    { url: `${baseUrl}/super-index`, priority: 0.9, changefreq: 'weekly' },
    { url: `${baseUrl}/about`, priority: 0.7, changefreq: 'monthly' },
    { url: `${baseUrl}/contact`, priority: 0.5, changefreq: 'yearly' },
    { url: `${baseUrl}/recommended`, priority: 0.8, changefreq: 'weekly' },
    { url: `${baseUrl}/commands`, priority: 0.6, changefreq: 'monthly' },
  ];

  // 2. microCMSから動的な記事（用語）のスラッグを取得
  const termSlugs = await getAllTermSlugs();
  const termPages = termSlugs.map((slug) => ({
    url: `${baseUrl}/terms/${slug}`,
    priority: 0.8,
    changefreq: 'daily',
  }));

  console.log(`Found ${termPages.length} dynamic term pages.`);

  const allUrls = [...staticPages, ...termPages];

  // 3. XMLサイトマップの文字列を生成
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(({ url, priority, changefreq }) => {
      return `
    <url>
      <loc>${url}</loc>
      <priority>${priority}</priority>
      <changefreq>${changefreq}</changefreq>
    </url>
  `;
    })
    .join('')}
</urlset>`;

  // 4. publicディレクトリにsitemap.xmlを書き出す
  fs.writeFileSync('public/sitemap.xml', sitemap);

  console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap();