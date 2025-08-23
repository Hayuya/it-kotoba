import { createClient } from 'microcms-js-sdk'

// 環境変数の確認（サーバーサイドのみ使用）
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
const apiKey = process.env.MICROCMS_API_KEY

// デバッグ情報をログ出力（開発環境のみ）
if (process.env.NODE_ENV !== 'production') {
  console.log('microCMS設定確認:')
  console.log('- Service Domain:', serviceDomain || 'NOT SET')
  console.log('- API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET')
}

if (!serviceDomain || !apiKey) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ microCMSの環境変数が設定されていません。開発環境では一部機能が制限されます。')
    console.warn('必要な環境変数:')
    console.warn('- MICROCMS_SERVICE_DOMAIN')
    console.warn('- MICROCMS_API_KEY')
  }
}

// microCMSクライアントの設定（サーバーサイド専用）
// 環境変数が設定されていない場合はダミー値を使用
let client: any = null

try {
  if (serviceDomain && apiKey) {
    client = createClient({
      serviceDomain,
      apiKey,
    })
  } else {
    // ダミークライアント（開発時用）
    client = {
      get: () => Promise.resolve({ contents: [], totalCount: 0, offset: 0, limit: 0 })
    }
  }
} catch (error) {
  console.error('microCMSクライアントの初期化に失敗しました:', error)
  // ダミークライアント
  client = {
    get: () => Promise.resolve({ contents: [], totalCount: 0, offset: 0, limit: 0 })
  }
}

export { client }

// API関連の型定義
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon: string
  order: number
  parent?: {
    id: string
    name: string
    slug: string
    icon: string
    description?: string
  } | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
}

export interface Term {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: Category
  difficulty: string[] // 配列形式に変更
  tags: Tag[]
  relatedTerms: Term[]
  isRecommended: boolean
  order?: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
}

export interface MicroCMSListResponse<T> {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}

// 用語関連のAPI関数
export const getTerms = async (queries?: {
  limit?: number
  offset?: number
  orders?: string
  q?: string
  filters?: string
  fields?: string[]
}): Promise<MicroCMSListResponse<Term>> => {
  if (!client) {
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }

  try {
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        limit: queries?.limit || 10,
        offset: queries?.offset || 0,
        orders: queries?.orders || '-publishedAt',
        q: queries?.q,
        filters: queries?.filters,
        fields: queries?.fields?.join(','),
      },
    })

    const { contents, totalCount, offset, limit } = result

    return {
      contents: contents || [],
      totalCount: totalCount || 0,
      offset: offset || 0,
      limit: limit || 0,
    }
  } catch (error) {
    console.error('Error fetching terms:', error)
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }
}

// クライアントサイド用のAPI関数（APIルート経由）
export const getTermsClient = async (queries?: {
  limit?: number
  offset?: number
  orders?: string
  q?: string
  filters?: string
}): Promise<MicroCMSListResponse<Term>> => {
  try {
    const searchParams = new URLSearchParams()
    
    if (queries?.limit) searchParams.set('limit', queries.limit.toString())
    if (queries?.offset) searchParams.set('offset', queries.offset.toString())
    if (queries?.orders) searchParams.set('orders', queries.orders)
    if (queries?.q) searchParams.set('q', queries.q)
    if (queries?.filters) searchParams.set('filters', queries.filters)

    const response = await fetch(`/api/terms?${searchParams.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch terms')
    }

    const data = await response.json()
    return data.success ? data.data : {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  } catch (error) {
    console.error('Error fetching terms (client):', error)
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }
}

export const getTermBySlug = async (slug: string): Promise<Term | null> => {
  if (!client) {
    return null
  }

  try {
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    const { contents } = result

    if (!contents || contents.length === 0) {
      return null
    }

    const term = contents[0]
    
    // tagsとrelatedTermsがundefinedの場合は空配列に設定
    return {
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }
  } catch (error) {
    console.error('Error fetching term by slug:', error)
    return null
  }
}

export const getRecommendedTerms = async (limit: number = 6): Promise<Term[]> => {
  if (!client) {
    return []
  }

  try {
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        filters: 'isRecommended[equals]true',
        limit,
        orders: 'order',
      },
    })

    const { contents } = result

    if (!contents) {
      return []
    }

    // 各termのtagsとrelatedTermsを安全に処理
    return contents.map((term: any) => ({
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }))
  } catch (error) {
    console.error('Error fetching recommended terms:', error)
    return []
  }
}

// クライアントサイド用のおすすめ記事取得関数
export const getRecommendedTermsClient = async (limit: number = 6): Promise<Term[]> => {
  try {
    const response = await fetch(`/api/terms?filters=isRecommended[equals]true&limit=${limit}&orders=order`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch recommended terms')
    }

    const data = await response.json()
    return data.success ? data.data.contents : []
  } catch (error) {
    console.error('Error fetching recommended terms (client):', error)
    return []
  }
}

export const getTermsByCategory = async (
  categorySlug: string,
  queries?: {
    limit?: number
    offset?: number
    orders?: string
  }
): Promise<MicroCMSListResponse<Term>> => {
  if (!client) {
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }

  try {
    // まずカテゴリーIDを取得
    const category = await getCategoryBySlug(categorySlug)
    if (!category) {
      return {
        contents: [],
        totalCount: 0,
        offset: 0,
        limit: 0,
      }
    }

    const result = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `category[equals]${category.id}`,
        limit: queries?.limit || 10,
        offset: queries?.offset || 0,
        orders: queries?.orders || 'order',
      },
    })

    const { contents, totalCount, offset, limit } = result

    // 各termのtagsとrelatedTermsを安全に処理
    const safeContents = (contents || []).map((term: any) => ({
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }))

    return {
      contents: safeContents,
      totalCount: totalCount || 0,
      offset: offset || 0,
      limit: limit || 0,
    }
  } catch (error) {
    console.error('Error fetching terms by category:', error)
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }
}

export const getTermsByTag = async (
  tagId: string,
  queries?: {
    limit?: number
    offset?: number
  }
): Promise<MicroCMSListResponse<Term>> => {
  if (!client) {
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }

  try {
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `tags[contains]${tagId}`,
        limit: queries?.limit || 10,
        offset: queries?.offset || 0,
        orders: '-publishedAt',
      },
    })

    const { contents, totalCount, offset, limit } = result

    // 各termのtagsとrelatedTermsを安全に処理
    const safeContents = (contents || []).map((term: any) => ({
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }))

    return {
      contents: safeContents,
      totalCount: totalCount || 0,
      offset: offset || 0,
      limit: limit || 0,
    }
  } catch (error) {
    console.error('Error fetching terms by tag:', error)
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }
}

export const searchTerms = async (
  keyword: string,
  queries?: {
    limit?: number
    offset?: number
  }
): Promise<MicroCMSListResponse<Term>> => {
  if (!client) {
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }

  try {
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        q: keyword,
        limit: queries?.limit || 10,
        offset: queries?.offset || 0,
        orders: '-publishedAt',
      },
    })

    const { contents, totalCount, offset, limit } = result

    // 各termのtagsとrelatedTermsを安全に処理
    const safeContents = (contents || []).map((term: any) => ({
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }))

    return {
      contents: safeContents,
      totalCount: totalCount || 0,
      offset: offset || 0,
      limit: limit || 0,
    }
  } catch (error) {
    console.error('Error searching terms:', error)
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }
}

// カテゴリー関連のAPI関数
export const getCategories = async (): Promise<Category[]> => {
  if (!client) {
    return []
  }

  try {
    const result = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
      },
    })

    const { contents } = result

    if (!contents) {
      return []
    }

    // 親カテゴリーのみを返す（階層構造の最上位のみ）
    return contents.filter((category: Category) => !category.parent)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// 全カテゴリー（階層構造含む）を取得
export const getAllCategories = async (): Promise<Category[]> => {
  if (!client) {
    return []
  }

  try {
    const result = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
      },
    })

    const { contents } = result

    return contents || []
  } catch (error) {
    console.error('Error fetching all categories:', error)
    return []
  }
}

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (!client) {
    return null
  }

  try {
    const result = await client.get({
      endpoint: 'categories',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    const { contents } = result

    return contents && contents.length > 0 ? contents[0] : null
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return null
  }
}

// タグ関連のAPI関数
export const getTags = async (): Promise<Tag[]> => {
  if (!client) {
    return []
  }

  try {
    const result = await client.get({
      endpoint: 'tags',
      queries: {
        limit: 100,
        orders: 'name',
      },
    })

    const { contents } = result

    return contents || []
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  if (!client) {
    return null
  }

  try {
    const result = await client.get({
      endpoint: 'tags',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    const { contents } = result

    return contents && contents.length > 0 ? contents[0] : null
  } catch (error) {
    console.error('Error fetching tag by slug:', error)
    return null
  }
}

// ユーティリティ関数
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getDifficultyLabel = (difficulty: string | string[]): string => {
  // 配列の場合は最初の要素を使用
  const level = Array.isArray(difficulty) ? difficulty[0] : difficulty
  
  switch (level) {
    case 'beginner':
      return '初級'
    case 'intermediate':
      return '中級'
    case 'advanced':
      return '上級'
    default:
      return '不明'
  }
}

export const getDifficultyColor = (difficulty: string | string[]): string => {
  // 配列の場合は最初の要素を使用
  const level = Array.isArray(difficulty) ? difficulty[0] : difficulty
  
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800'
    case 'advanced':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// プレビュー機能用
export const getTermPreview = async (slug: string, draftKey: string): Promise<Term | null> => {
  if (!client) {
    return null
  }

  try {
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
        draftKey,
      },
    })

    const { contents } = result

    if (!contents || contents.length === 0) {
      return null
    }

    const term = contents[0]
    
    return {
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }
  } catch (error) {
    console.error('Error fetching term preview:', error)
    return null
  }
}

// サイトマップ生成用
export const getAllTermSlugs = async (): Promise<string[]> => {
  if (!client) {
    return []
  }

  try {
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        fields: 'slug',
        limit: 1000, // 必要に応じて調整
      },
    })

    const { contents } = result

    return (contents || []).map((term: { slug: string }) => term.slug)
  } catch (error) {
    console.error('Error fetching all term slugs:', error)
    return []
  }
}

export const getAllCategorySlugs = async (): Promise<string[]> => {
  if (!client) {
    return []
  }

  try {
    const result = await client.get({
      endpoint: 'categories',
      queries: {
        fields: 'slug',
        limit: 100,
      },
    })

    const { contents } = result

    return (contents || []).map((category: { slug: string }) => category.slug)
  } catch (error) {
    console.error('Error fetching all category slugs:', error)
    return []
  }
}

// 統計情報取得用
export const getStats = async () => {
  if (!client) {
    return {
      totalTerms: 0,
      totalCategories: 0,
    }
  }

  try {
    const [termsResponse, categoriesResponse] = await Promise.all([
      client.get({ endpoint: 'terms', queries: { limit: 0 } }),
      client.get({ endpoint: 'categories', queries: { limit: 0 } }),
    ])

    return {
      totalTerms: termsResponse.totalCount || 0,
      totalCategories: categoriesResponse.totalCount || 0,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalTerms: 0,
      totalCategories: 0,
    }
  }
}