import { createClient } from 'microcms-js-sdk'

// 環境変数の取得と検証
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
const apiKey = process.env.MICROCMS_API_KEY

// 環境変数チェック関数
const checkEnvironmentVariables = () => {
  const errors: string[] = []
  
  if (!serviceDomain) {
    errors.push('MICROCMS_SERVICE_DOMAIN is not set')
  }
  
  if (!apiKey) {
    errors.push('MICROCMS_API_KEY is not set')
  }
  
  if (errors.length > 0) {
    console.error('❌ microCMS configuration errors:')
    errors.forEach(error => console.error(`  - ${error}`))
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${errors.join(', ')}`)
    }
  } else {
    console.log('✅ microCMS environment variables configured correctly')
  }
}

// 開発環境でのチェック
if (process.env.NODE_ENV !== 'production') {
  checkEnvironmentVariables()
}

// microCMSクライアントの作成
let client: any = null

if (serviceDomain && apiKey) {
  try {
    client = createClient({
      serviceDomain,
      apiKey,
    })
    console.log('✅ microCMS client initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize microCMS client:', error)
    throw error
  }
} else {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('microCMS configuration is required in production')
  }
  
  // 開発環境用のフォールバック
  console.warn('⚠️ Using fallback client for development')
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
  difficulty: string[]
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

// エラーハンドリング用のヘルパー関数
const handleApiError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error)
  
  // ネットワークエラーの場合
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    console.error('Network connection error - check your internet connection')
  }
  
  // microCMS APIエラーの場合
  if (error.response?.status) {
    console.error(`microCMS API error: ${error.response.status}`)
    if (error.response.status === 401) {
      console.error('Authentication failed - check your API key')
    }
    if (error.response.status === 404) {
      console.error('Endpoint not found - check your service domain and endpoint')
    }
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
  if (!client) {
    console.warn('Client not available, returning empty result')
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    }
  }

  try {
    const queryParams = {
      limit: queries?.limit || 10,
      offset: queries?.offset || 0,
      orders: queries?.orders || '-publishedAt',
      ...(queries?.q && { q: queries.q }),
      ...(queries?.filters && { filters: queries.filters }),
      ...(queries?.fields && { fields: queries.fields.join(',') }),
    }

    console.log('Fetching terms with queries:', queryParams)

    const result = await client.get({
      endpoint: 'terms',
      queries: queryParams,
    })

    console.log(`✅ Successfully fetched ${result.contents?.length || 0} terms`)

    return {
      contents: result.contents || [],
      totalCount: result.totalCount || 0,
      offset: result.offset || 0,
      limit: result.limit || 0,
    }
  } catch (error) {
    handleApiError(error, 'getTerms')
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
    console.warn('Client not available')
    return null
  }

  try {
    console.log(`Fetching term by slug: ${slug}`)
    
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    if (!result.contents || result.contents.length === 0) {
      console.log(`Term not found for slug: ${slug}`)
      return null
    }

    const term = result.contents[0]
    
    console.log(`✅ Found term: ${term.title}`)
    
    return {
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }
  } catch (error) {
    handleApiError(error, 'getTermBySlug')
    return null
  }
}

export const getRecommendedTerms = async (limit: number = 6): Promise<Term[]> => {
  if (!client) {
    console.warn('Client not available')
    return []
  }

  try {
    console.log(`Fetching ${limit} recommended terms`)
    
    const result = await client.get({
      endpoint: 'terms',
      queries: {
        filters: 'isRecommended[equals]true',
        limit,
        orders: 'order',
      },
    })

    if (!result.contents) {
      console.log('No recommended terms found')
      return []
    }

    const terms = result.contents.map((term: any) => ({
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }))

    console.log(`✅ Found ${terms.length} recommended terms`)
    return terms
  } catch (error) {
    handleApiError(error, 'getRecommendedTerms')
    return []
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
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'API returned error')
    }

    return data.data
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
    console.log(`Fetching terms for category: ${categorySlug}`)
    
    // まずカテゴリーIDを取得
    const category = await getCategoryBySlug(categorySlug)
    if (!category) {
      console.log(`Category not found: ${categorySlug}`)
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

    const safeContents = (result.contents || []).map((term: any) => ({
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }))

    console.log(`✅ Found ${safeContents.length} terms for category ${category.name}`)

    return {
      contents: safeContents,
      totalCount: result.totalCount || 0,
      offset: result.offset || 0,
      limit: result.limit || 0,
    }
  } catch (error) {
    handleApiError(error, 'getTermsByCategory')
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
    console.warn('Client not available')
    return []
  }

  try {
    console.log('Fetching categories')
    
    const result = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
      },
    })

    if (!result.contents) {
      console.log('No categories found')
      return []
    }

    // 親カテゴリーのみを返す
    const parentCategories = result.contents.filter((category: Category) => !category.parent)
    
    console.log(`✅ Found ${parentCategories.length} parent categories`)
    return parentCategories
  } catch (error) {
    handleApiError(error, 'getCategories')
    return []
  }
}

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (!client) {
    return null
  }

  try {
    console.log(`Fetching category by slug: ${slug}`)
    
    const result = await client.get({
      endpoint: 'categories',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    if (!result.contents || result.contents.length === 0) {
      console.log(`Category not found: ${slug}`)
      return null
    }

    const category = result.contents[0]
    console.log(`✅ Found category: ${category.name}`)
    
    return category
  } catch (error) {
    handleApiError(error, 'getCategoryBySlug')
    return null
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
    console.log('Fetching site statistics')
    
    const [termsResponse, categoriesResponse] = await Promise.all([
      client.get({ endpoint: 'terms', queries: { limit: 0 } }),
      client.get({ endpoint: 'categories', queries: { limit: 0 } }),
    ])

    const stats = {
      totalTerms: termsResponse.totalCount || 0,
      totalCategories: categoriesResponse.totalCount || 0,
    }

    console.log(`✅ Stats - Terms: ${stats.totalTerms}, Categories: ${stats.totalCategories}`)
    return stats
  } catch (error) {
    handleApiError(error, 'getStats')
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