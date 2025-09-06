import type { Category } from './microcms';

// ツリー構造のカテゴリーの型定義
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

/**
 * フラットなカテゴリー配列をツリー構造に変換します。
 * @param categories - microCMSから取得した全カテゴリーの配列
 * @returns ツリー構造になったカテゴリーの配列
 */
export const buildCategoryTree = (categories: Category[]): CategoryTreeNode[] => {
  const categoryMap = new Map<string, CategoryTreeNode>();
  const rootCategories: CategoryTreeNode[] = [];

  // 1. 各カテゴリーをMapに格納し、childrenプロパティを初期化
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // 2. 親子関係を構築
  categories.forEach(category => {
    const node = categoryMap.get(category.id);
    if (node) {
      if (category.parent?.id) {
        const parentNode = categoryMap.get(category.parent.id);
        if (parentNode) {
          parentNode.children.push(node);
        }
      } else {
        rootCategories.push(node);
      }
    }
  });

  return rootCategories;
};