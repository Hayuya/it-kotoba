import type { Category, Term } from './microcms';

// 処理を軽量化するため、必要なプロパティのみを型として定義
export interface TermNode extends Pick<Term, 'id' | 'title' | 'slug'> {}

export interface CategoryNode extends Pick<Category, 'id' | 'name' | 'slug' | 'icon'> {
  children: CategoryNode[];
  terms: TermNode[];
}

/**
 * microCMSから取得したフラットなカテゴリーと用語のリストを
 * 親 > 子 > 孫 の3階層のツリー構造に変換する関数
 *
 * @param allCategories - microCMSから取得した全カテゴリーの配列
 * @param allTerms - microCMSから取得した全用語の配列
 * @returns 階層化されたCategoryNodeの配列
 */
export function buildCategoryTree(
  allCategories: Category[],
  allTerms: Pick<Term, 'id' | 'title' | 'slug' | 'category'>[]
): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();
  const rootNodes: CategoryNode[] = [];

  // 1. 用語をカテゴリーIDごとにグループ化
  const termsByCategoryId = new Map<string, TermNode[]>();
  for (const term of allTerms) {
    if (term.category) {
      if (!termsByCategoryId.has(term.category.id)) {
        termsByCategoryId.set(term.category.id, []);
      }
      termsByCategoryId.get(term.category.id)!.push({
        id: term.id,
        title: term.title,
        slug: term.slug,
      });
    }
  }

  // 2. すべてのカテゴリーをCategoryNodeに変換してMapに格納
  for (const category of allCategories) {
    categoryMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      children: [],
      terms: termsByCategoryId.get(category.id) || [],
    });
  }

  // 3. 親子関係を構築
  for (const category of allCategories) {
    const node = categoryMap.get(category.id);
    if (node) {
      if (category.parent) {
        const parentNode = categoryMap.get(category.parent.id);
        if (parentNode) {
          parentNode.children.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    }
  }

  return rootNodes;
}