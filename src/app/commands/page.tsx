import { Metadata } from 'next'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'コマンド置き場 - IT言葉辞典',
  description: 'よく使うコマンドや、知っていると便利なコマンドに関する用語をまとめました。',
  robots: {
  },
}

export default function CommandsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <IndexSidebar />
          </aside>
          <main className="lg:w-3/4">
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900">コマンド置き場</h1>
              <p className="text-gray-600 mt-2">よく使うコマンドや、知っていると便利なコマンドに関する用語をまとめました。</p>
            </header>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">現在準備中です</h3>
              <p className="text-gray-600 mb-6">
                このページは現在準備中です。コンテンツが追加されるまで、もうしばらくお待ちください。
              </p>
              <Link 
                href="/" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                トップページへ戻る
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}