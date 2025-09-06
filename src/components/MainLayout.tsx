'use client' // このコンポーネントをクライアントコンポーネントとして定義

import IndexSidebar from './IndexSidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children}: MainLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* サイドバー */}
        <aside className="lg:w-1/4 self-start"> {/* self-start を追加 */}
          <IndexSidebar />
        </aside>

        {/* メインコンテンツ */}
        <main className="lg:w-3/4">
          {children}
        </main>
      </div>
    </div>
  )
}