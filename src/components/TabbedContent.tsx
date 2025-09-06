'use client'

import { useState } from 'react';

// このコンポーネントが受け取るPropsの型を定義
interface TabbedContentProps {
  categoryTree: React.ReactNode;
  superIndex: React.ReactNode;
}

export default function TabbedContent({ categoryTree, superIndex }: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState<'category' | 'index'>('category');

  const tabStyle = "px-6 py-3 font-semibold text-sm rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2";
  const activeTabStyle = "bg-white text-blue-700 shadow-sm";
  const inactiveTabStyle = "bg-gray-200 text-gray-600 hover:bg-gray-300";

  return (
    <div>
      {/* タブボタンのエリア */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('category')}
          className={`${tabStyle} ${activeTab === 'category' ? activeTabStyle : inactiveTabStyle}`}
          role="tab"
          aria-selected={activeTab === 'category'}
        >
          カテゴリー
        </button>
        <button
          onClick={() => setActiveTab('index')}
          className={`${tabStyle} ${activeTab === 'index' ? activeTabStyle : inactiveTabStyle}`}
          role="tab"
          aria-selected={activeTab === 'index'}
        >
          ABC索引
        </button>
      </div>

      {/* タブの中身を表示するエリア */}
      <div className="bg-white rounded-b-lg rounded-tr-lg shadow-sm">
        {activeTab === 'category' ? categoryTree : superIndex}
      </div>
    </div>
  );
}