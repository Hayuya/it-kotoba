import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import RecommendedSlider from '../components/RecommendedSlider'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー */}
          <aside className="lg:w-1/4">
            <Sidebar />
          </aside>

          {/* メインコンテンツ */}
          <main className="lg:w-3/4">
            {/* ヒーローセクション */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
              <h1 className="text-4xl font-bold mb-4">IT合言葉</h1>
              <p className="text-xl mb-6">
                情報処理安全確保支援士試験対策のための<br />
                IT用語解説サイト
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">📚 試験範囲を完全網羅</span>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">🔍 高速検索機能</span>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">📖 分かりやすい解説</span>
                </div>
              </div>
            </section>

            {/* おすすめ記事スライダー */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">おすすめ用語</h2>
              <RecommendedSlider />
            </section>

            {/* カテゴリー別用語紹介 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">カテゴリー別用語</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">🔐</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">暗号・認証</h3>
                  <p className="text-gray-600 mb-4">
                    暗号化技術、認証方式、デジタル署名などのセキュリティ基盤技術
                  </p>
                  <a href="/category/crypto" className="text-blue-600 hover:text-blue-800 font-medium">
                    詳細を見る →
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">🛡️</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">脅威・攻撃</h3>
                  <p className="text-gray-600 mb-4">
                    サイバー攻撃、脆弱性、マルウェアなどのセキュリティ脅威
                  </p>
                  <a href="/category/threats" className="text-blue-600 hover:text-blue-800 font-medium">
                    詳細を見る →
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">🌐</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">ネットワーク</h3>
                  <p className="text-gray-600 mb-4">
                    TCP/IP、ファイアウォール、VPNなどのネットワークセキュリティ
                  </p>
                  <a href="/category/network" className="text-blue-600 hover:text-blue-800 font-medium">
                    詳細を見る →
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">法律・制度</h3>
                  <p className="text-gray-600 mb-4">
                    個人情報保護法、サイバーセキュリティ基本法などの関連法規
                  </p>
                  <a href="/category/legal" className="text-blue-600 hover:text-blue-800 font-medium">
                    詳細を見る →
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">🏢</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">組織・管理</h3>
                  <p className="text-gray-600 mb-4">
                    ISMS、リスク管理、インシデント対応などの組織的対策
                  </p>
                  <a href="/category/management" className="text-blue-600 hover:text-blue-800 font-medium">
                    詳細を見る →
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">💻</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">システム</h3>
                  <p className="text-gray-600 mb-4">
                    OS、データベース、Webアプリケーションのセキュリティ
                  </p>
                  <a href="/category/systems" className="text-blue-600 hover:text-blue-800 font-medium">
                    詳細を見る →
                  </a>
                </div>
              </div>
            </section>

            {/* 統計情報 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">サイト統計</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">登録用語数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">15</div>
                  <div className="text-gray-600">カテゴリー数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">毎日更新</div>
                  <div className="text-gray-600">更新頻度</div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}