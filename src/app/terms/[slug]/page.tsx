import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import IndexSidebar from '../../../components/IndexSidebar'
import CopyUrlButton from '../../../components/CopyUrlButton'
import { 
  getTermBySlug, 
  getCategories, 
  getDifficultyColor, 
  getDifficultyLabel, 
  formatDate 
} from '../../../lib/microcms'

interface Props {
  params: { slug: string }
}

// メタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const term = await getTermBySlug(params.slug)
  
  if (!term) {
    return {
      title: 'ページが見つかりません - IT合言葉'
    }
  }

  // tagsが存在しない場合の安全な処理
  const tags = term.tags || []
  const keywords = [term.title, ...tags.map(tag => tag.name), '情報処理安全確保支援士', 'IT用語'].join(', ')

  return {
    title: `${term.title} - IT合言葉`,
    description: term.description,
    keywords: keywords,
    openGraph: {
      title: `${term.title} - IT合言葉`,
      description: term.description,
      type: 'article',
      publishedTime: term.publishedAt,
      modifiedTime: term.updatedAt,
      tags: tags.map(tag => tag.name),
    },
    twitter: {
      card: 'summary',
      title: `${term.title} - IT合言葉`,
      description: term.description,
    }
  }
}

export default async function TermPage({ params }: Props) {
  const [term, categories] = await Promise.all([
    getTermBySlug(params.slug),
    getCategories()
  ])
  
  if (!term) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const currentUrl = `${siteUrl}/terms/${term.slug}`

  // tagsとrelatedTermsの安全な処理
  const tags = term.tags || []
  const relatedTerms = term.relatedTerms || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー */}
          <aside className="lg:w-1/4">
            <IndexSidebar categories={categories} />
          </aside>

          {/* メインコンテンツ */}
          <main className="lg:w-3/4">
            {/* パンくずリスト */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-blue-600">
                    ホーム
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/terms" className="hover:text-blue-600">
                    用語一覧
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href={`/category/${term.category.slug}`} className="hover:text-blue-600">
                    {term.category.name}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-800 font-medium">{term.title}</li>
              </ol>
            </nav>

            {/* メイン記事 */}
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* ヘッダー */}
              <header className="p-8 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{term.category.icon}</span>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {term.category.name}
                    </span>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(term.difficulty)}`}>
                    {getDifficultyLabel(term.difficulty)}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{term.title}</h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">{term.description}</p>
                
                {/* タグ */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* 更新日時 */}
                <div className="text-sm text-gray-500 flex items-center space-x-4">
                  <span>公開: {formatDate(term.publishedAt)}</span>
                  <span>更新: {formatDate(term.updatedAt)}</span>
                </div>
              </header>

              {/* 本文 */}
              <div className="p-8">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: term.content }}
                />
              </div>

              {/* フッター */}
              <footer className="p-8 bg-gray-50 border-t border-gray-200">
                {/* 関連用語 */}
                {relatedTerms.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">関連用語</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {relatedTerms.map((relatedTerm) => (
                        <Link
                          key={relatedTerm.id}
                          href={`/terms/${relatedTerm.slug}`}
                          className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <span className="text-blue-600 hover:text-blue-800 font-medium">
                            {relatedTerm.title} →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* シェアボタン */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">この記事をシェア</h4>
                    <div className="flex space-x-3">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(term.title)}&url=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                      <CopyUrlButton url={currentUrl} />
                    </div>
                  </div>
                  
                  <Link
                    href="/terms"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    用語一覧に戻る
                  </Link>
                </div>
              </footer>
            </article>
          </main>
        </div>
      </div>

      {/* JSON-LD構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": term.title,
            "description": term.description,
            "author": {
              "@type": "Organization",
              "name": "IT合言葉編集部"
            },
            "publisher": {
              "@type": "Organization",
              "name": "IT合言葉",
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
              }
            },
            "datePublished": term.publishedAt,
            "dateModified": term.updatedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": currentUrl
            },
            "keywords": tags.map(tag => tag.name).join(", "),
            "articleSection": term.category.name
          })
        }}
      />
    </div>
  )
}