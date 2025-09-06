import { createClient } from 'microcms-js-sdk'


// 環境変数の確認（サーバーサイドのみ使用）
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
const apiKey = process.env.MICROCMS_API_KEY

// デバッグ情報をログ出力
console.log('microCMS設定確認:')
console.log('- Service Domain:', serviceDomain || 'NOT SET')
console.log('- API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET')

if (!serviceDomain || !apiKey) {
  console.warn('⚠️ microCMSの環境変数が設定されていません。開発環境では一部機能が制限されます。')
  console.warn('必要な環境変数:')
  console.warn('- MICROCMS_SERVICE_DOMAIN')
  console.warn('- MICROCMS_API_KEY')
}

// microCMSクライアントの設定（サーバーサイド専用）
export const client = createClient({
  serviceDomain: serviceDomain || 'MICROCMS_SERVICE_DOMAIN',
  apiKey: apiKey || 'MICROCMS_API_KEY',
})

// API関連の型定義

// ▼▼▼ Category型定義を追加 ▼▼▼
export interface Category {
  id: string
  name: string
  parent?: Category
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
  difficulty: string[] // 配列形式に変更
  // ▼▼▼ categoryフィールドを追加 ▼▼▼
  category?: Category
  tags: Tag[]
  relatedTerms: Term[]
  isRecommended: boolean
  order?: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  search_title?: string;
}

export interface MicroCMSListResponse<T> {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}

// ▼▼▼ 全カテゴリーを取得する関数を新規作成 ▼▼▼
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const allContents: Category[] = [];
    const limit = 100;
    let offset = 0;
    let totalCount = 0;

    const firstResponse = await client.get<MicroCMSListResponse<Category>>({
      endpoint: 'categories',
      queries: { limit, offset, fields: 'id,name,parent' },
    });

    allContents.push(...firstResponse.contents);
    totalCount = firstResponse.totalCount;
    offset += limit;

    const promises = [];
    while (offset < totalCount) {
      promises.push(
        client.get<MicroCMSListResponse<Category>>({
          endpoint: 'categories',
          queries: { limit, offset, fields: 'id,name,parent' },
        })
      );
      offset += limit;
    }

    const responses = await Promise.all(promises);
    responses.forEach(res => allContents.push(...res.contents));

    return allContents;
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
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
  try {
    const { contents } = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    })

    if (contents.length === 0) {
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
  try {
    const { contents } = await client.get({
      endpoint: 'terms',
      queries: {
        filters: 'isRecommended[equals]true',
        limit,
        orders: 'order',
      },
    })

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

export const getTermsByTag = async (
  tagId: string,
  queries?: {
    limit?: number
    offset?: number
  }
): Promise<MicroCMSListResponse<Term>> => {
  try {
    const { contents, totalCount, offset, limit } = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `tags[contains]${tagId}`,
        limit: queries?.limit || 10,
        offset: queries?.offset || 0,
        orders: '-publishedAt',
      },
    })

    // 各termのtagsとrelatedTermsを安全に処理
    const safeContents = contents.map((term: any) => ({
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }))

    return {
      contents: safeContents,
      totalCount,
      offset,
      limit,
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
  try {
    const { contents, totalCount, offset, limit } = await client.get({
      endpoint: 'terms',
      queries: {
        q: keyword,
        limit: queries?.limit || 10,
        offset: queries?.offset || 0,
        orders: '-publishedAt',
      },
    })

    // 各termのtagsとrelatedTermsを安全に処理
    const safeContents = contents.map((term: any) => ({
      ...term,
      tags: term.tags || [],
      relatedTerms: term.relatedTerms || [],
    }))

    return {
      contents: safeContents,
      totalCount,
      offset,
      limit,
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
  try {
    const { contents } = await client.get({
      endpoint: 'terms',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
        draftKey,
      },
    })

    if (contents.length === 0) {
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

// ▼▼▼ `SearchableTerm` 型定義に `category` を追加 ▼▼▼
type SearchableTerm = Pick<Term, 'id' | 'title' | 'slug' | 'difficulty' | 'description' | 'publishedAt' | 'search_title' | 'category'>;


/**
 * 索引・検索機能専用：軽量な全用語データをページネーションで全件取得する
 */
export const getAllSearchableTerms = async (): Promise<SearchableTerm[]> => {
  try {
    const allContents: SearchableTerm[] = [];
    const limit = 100; // APIの上限である100件ずつ取得
    let offset = 0;
    let totalCount = 0;

    // ▼▼▼ fieldsに`category`を追加 ▼▼▼
    const fields = 'id,title,slug,difficulty,description,publishedAt,search_title,category';

    // 最初に一度取得して全体の件数を把握する
    const firstResponse = await client.get<MicroCMSListResponse<SearchableTerm>>({
      endpoint: 'terms',
      queries: {
        limit,
        offset,
        fields,
      },
    });

    allContents.push(...firstResponse.contents);
    totalCount = firstResponse.totalCount;
    offset += limit;

    // 残りのデータを並行して取得する
    const promises = [];
    while (offset < totalCount) {
      promises.push(
        client.get<MicroCMSListResponse<SearchableTerm>>({
          endpoint: 'terms',
          queries: {
            limit,
            offset,
            fields,
          },
        })
      );
      offset += limit;
    }

    const responses = await Promise.all(promises);
    responses.forEach(res => allContents.push(...res.contents));

    return allContents;
    
  } catch (error) {
    console.error('Error fetching all searchable terms:', error);
    return [];
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