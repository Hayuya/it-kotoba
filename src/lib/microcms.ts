import { createClient } from 'microcms-js-sdk'

// microCMSクライアントの設定
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '',
  apiKey: process.env.MICROCMS_API_KEY || '',
})

// API関連の型定義
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon: string
  order: number
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
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: Tag[]
  relatedTerms: Term[]
  isRecommended: boolean
  order: number
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
  const { contents, totalCount, offset, limit } = await client.get({
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
    contents,
    totalCount,
    offset,
    limit,
  }
}

export const getTermBySlug = async (slug: string): Promise<Term | null> => {
  try {
    const { contents } = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    return contents.length > 0 ? contents[0] : null
  } catch (error) {
    console.error('Error fetching term by slug:', error)
    return null
  }
}

export const getRecommendedTerms = async (limit: number = 6): Promise<Term[]> => {
  try {
    const { contents } = await client.get({
      endpoint: 'terms',
      queries: {
        filters: 'isRecommended[equals]true',
        limit,
        orders: 'order',
      },
    })

    return contents
  } catch (error) {
    console.error('Error fetching recommended terms:', error)
    return []
  }
}

export const getTermsByCategory = async (
  categoryId: string,
  queries?: {
    limit?: number
    offset?: number
    orders?: string
  }
): Promise<MicroCMSListResponse<Term>> => {
  const { contents, totalCount, offset, limit } = await client.get({
    endpoint: 'terms',
    queries: {
      filters: `category[equals]${categoryId}`,
      limit: queries?.limit || 10,
      offset: queries?.offset || 0,
      orders: queries?.orders || 'order',
    },
  })

  return {
    contents,
    totalCount,
    offset,
    limit,
  }
}

export const getTermsByTag = async (
  tagId: string,
  queries?: {
    limit?: number
    offset?: number
  }
): Promise<MicroCMSListResponse<Term>> => {
  const { contents, totalCount, offset, limit } = await client.get({
    endpoint: 'terms',
    queries: {
      filters: `tags[contains]${tagId}`,
      limit: queries?.limit || 10,
      offset: queries?.offset || 0,
      orders: '-publishedAt',
    },
  })

  return {
    contents,
    totalCount,
    offset,
    limit,
  }
}

export const searchTerms = async (
  keyword: string,
  queries?: {
    limit?: number
    offset?: number
  }
): Promise<MicroCMSListResponse<Term>> => {
  const { contents, totalCount, offset, limit } = await client.get({
    endpoint: 'terms',
    queries: {
      q: keyword,
      limit: queries?.limit || 10,
      offset: queries?.offset || 0,
      orders: '-publishedAt',
    },
  })

  return {
    contents,
    totalCount,
    offset,
    limit,
  }
}

// カテゴリー関連のAPI関数
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { contents } = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'order',
      },
    })

    return contents
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const { contents } = await client.get({
      endpoint: 'categories',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    return contents.length > 0 ? contents[0] : null
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return null
  }
}

// タグ関連のAPI関数
export const getTags = async (): Promise<Tag[]> => {
  try {
    const { contents } = await client.get({
      endpoint: 'tags',
      queries: {
        limit: 100,
        orders: 'name',
      },
    })

    return contents
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  try {
    const { contents } = await client.get({
      endpoint: 'tags',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    return contents.length > 0 ? contents[0] : null
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

export const getDifficultyLabel = (difficulty: string): string => {
  switch (difficulty) {
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

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
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
  try {
    const { contents } = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
        draftKey,
      },
    })

    return contents.length > 0 ? contents[0] : null
  } catch (error) {
    console.error('Error fetching term preview:', error)
    return null
  }
}

// サイトマップ生成用
export const getAllTermSlugs = async (): Promise<string[]> => {
  try {
    const { contents } = await client.get({
      endpoint: 'terms',
      queries: {
        fields: 'slug',
        limit: 1000, // 必要に応じて調整
      },
    })

    return contents.map((term: { slug: string }) => term.slug)
  } catch (error) {
    console.error('Error fetching all term slugs:', error)
    return []
  }
}

export const getAllCategorySlugs = async (): Promise<string[]> => {
  try {
    const { contents } = await client.get({
      endpoint: 'categories',
      queries: {
        fields: 'slug',
        limit: 100,
      },
    })

    return contents.map((category: { slug: string }) => category.slug)
  } catch (error) {
    console.error('Error fetching all category slugs:', error)
    return []
  }
}

// 統計情報取得用
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
    console.error('Error fetching stats:', error)
    return {
      totalTerms: 0,
      totalCategories: 0,
    }
  }
}