import { createClient } from 'microcms-js-sdk'

// 環境変数の確認
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
const apiKey = process.env.MICROCMS_API_KEY

console.log('=== microCMS設定確認 ===')
console.log('Service Domain:', serviceDomain || 'NOT SET')
console.log('API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET')

if (!serviceDomain || !apiKey) {
  throw new Error('microCMSの環境変数が設定されていません。MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を設定してください。')
}

// microCMSクライアントの設定
export const client = createClient({
  serviceDomain,
  apiKey,
})

// 型定義
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
  difficulty: string | string[]
  tags: Tag[]
  relatedTerms?: Term[]
  isRecommended?: boolean
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

// カテゴリー関連のAPI関数
export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log('=== カテゴリー取得開始 ===')
    
    const response = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
      },
    })

    console.log('取得したカテゴリー数:', response.totalCount)
    console.log('カテゴリー一覧:', response.contents.map((cat: Category) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      order: cat.order,
      hasParent: !!cat.parent
    })))

    // 親カテゴリーと子カテゴリーを分離
    const parentCategories = response.contents.filter((category: Category) => !category.parent)
    const childCategories = response.contents.filter((category: Category) => !!category.parent)
    
    console.log('親カテゴリー数:', parentCategories.length)
    console.log('子カテゴリー数:', childCategories.length)
    
    // 親カテゴリーが少ない場合は、すべてのカテゴリーを表示
    if (parentCategories.length < 3) {
      console.log('親カテゴリーが少ないため、すべてのカテゴリーを表示します')
      return response.contents.sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0))
    }
    
    return parentCategories.sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error('カテゴリー取得エラー:', error)
    
    // エラー時はサンプルデータを返す
    return [
      {
        id: 'sample',
        name: 'サンプルカテゴリー',
        slug: 'sample',
        icon: '📚',
        order: 1,
        description: 'microCMSからデータを取得できませんでした',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        revisedAt: new Date().toISOString(),
      }
    ]
  }
}

// 全カテゴリー（階層構造含む）を取得
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
      },
    })

    return response.contents.sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error('全カテゴリー取得エラー:', error)
    return []
  }
}

// 親カテゴリーのみを取得
export const getParentCategories = async (): Promise<Category[]> => {
  try {
    const response = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
        filters: 'parent[not_exists]'
      },
    })

    return response.contents.sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error('親カテゴリー取得エラー:', error)
    return []
  }
}

// 子カテゴリーを取得（特定の親カテゴリーの）
export const getChildCategories = async (parentId: string): Promise<Category[]> => {
  try {
    const response = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
        filters: `parent[equals]${parentId}`
      },
    })

    return response.contents.sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error('子カテゴリー取得エラー:', error)
    return []
  }
}

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const response = await client.get({
      endpoint: 'categories',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    return response.contents.length > 0 ? response.contents[0] : null
  } catch (error) {
    console.error('カテゴリー（slug）取得エラー:', error)
    return null
  }
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
  try {
    const response = await client.get({
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

    return {
      contents: response.contents,
      totalCount: response.totalCount,
      offset: response.offset,
      limit: response.limit,
    }
  } catch (error) {
    console.error('用語取得エラー:', error)
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }
}

export const getTermBySlug = async (slug: string): Promise<Term | null> => {
  try {
    const response = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    return response.contents.length > 0 ? response.contents[0] : null
  } catch (error) {
    console.error('用語（slug）取得エラー:', error)
    return null
  }
}

export const getRecommendedTerms = async (limit: number = 6): Promise<Term[]> => {
  try {
    const response = await client.get({
      endpoint: 'terms',
      queries: {
        filters: 'isRecommended[equals]true',
        limit,
        orders: 'order',
      },
    })

    return response.contents
  } catch (error) {
    console.error('おすすめ用語取得エラー:', error)
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

    const response = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `category[equals]${category.id}`,
        limit: queries?.limit || 10,
        offset: queries?.offset || 0,
        orders: queries?.orders || 'order',
      },
    })

    return {
      contents: response.contents,
      totalCount: response.totalCount,
      offset: response.offset,
      limit: response.limit,
    }
  } catch (error) {
    console.error('カテゴリー別用語取得エラー:', error)
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }
}

// 統計情報取得
export const getStats = async () => {
  try {
    const [termsResponse, categoriesResponse] = await Promise.all([
      client.get({ endpoint: 'terms', queries: { limit: 0 } }),
      client.get({ endpoint: 'categories', queries: { limit: 0 } }),
    ])

    return {
      totalTerms: termsResponse.totalCount,
      totalCategories: categoriesResponse.totalCount,
    }
  } catch (error) {
    console.error('統計情報取得エラー:', error)
    return {
      totalTerms: 0,
      totalCategories: 0,
    }
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