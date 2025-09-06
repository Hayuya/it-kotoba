import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'

export const metadata: Metadata = {
  title: 'このサイトについて - IT言葉辞典',
  description: '「IT言葉辞典」は、IT資格の学習や実務で出会う専門用語を「瞬時に解決」するために生まれた、高速・高機能なIT用語辞典です。あなたの学習効果を最大化する「最高のお供」となることを目指しています。',
  openGraph: {
    title: 'このサイトについて - IT言葉辞典',
    description: '「IT言葉辞典」のコンセプト、機能、使い方について',
  },
}

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* サイドバー */}
          <aside className="lg:w-1/4">
            <IndexSidebar />
          </aside>

          {/* メインコンテンツ */}
          <main className="lg:w-3/4">
            {/* パンくずリスト */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-blue-600">
                    ホーム
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-800 font-medium">このサイトについて</li>
              </ol>
            </nav>

            {/* ヘッダーセクション */}
            <header className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">このサイトについて</h1>
              <p className="text-gray-600 leading-relaxed">
                「IT言葉辞典」は、IT資格の学習や実務で出会う専門用語の「分からない」を瞬時に解決するために生まれた、高速・高機能なIT用語辞典です。
                参考書や動画教材と併用することで、あなたの学習効果を最大化する「最高のお供」となることを目指しています。
              </p>
            </header>
            
            <section className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">サイトの３つの強み</h2>
              <div className="space-y-8">

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    高速表示と検索性
                  </h3>
                  <p className="text-gray-600 mb-4">
                    学習中の思考を止めさせない、ストレスフリーな体験を提供します。気になった用語は瞬時に検索・表示。豊富な絞り込み機能で、膨大な情報の中から目的の用語へ一直線にたどり着けます。
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    分かりやすさを追求した解説
                  </h3>
                  <p className="text-gray-600 mb-4">
                    単なる言葉の定義だけでなく、なぜそれが必要なのか、どのような場面で使われるのか、といった背景まで含めて解説。初学者でもイメージが掴めるよう、平易な言葉で説明することを心がけています。
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    知識が広がる回遊性
                  </h3>
                  <p className="text-gray-600 mb-4">
                    一つの用語を調べたら、関連用語を辿って知識をどんどん広げていけます。点だった知識が線となり、やがて面となって体系的な理解へと繋がります。<br />
                    <strong className="text-sm">※ 用語同士を直接結びつける「関連用語」機能は、現在実装準備中です。</strong>
                  </p>
                </div>

              </div>
            </section>
            
            <section className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🛠️ 使用技術スタック</h2>
              <p className="text-gray-600 mb-6">
                当サイトは、以下のWeb技術によって支えられています。
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Next.js (React)</h4>
                  <p className="text-sm text-gray-600 mt-1">高速な静的サイト生成(SSG)とサーバーサイドレンダリング(SSR)を組み合わせ、最高のパフォーマンスを実現しています。</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">TypeScript</h4>
                  <p className="text-sm text-gray-600 mt-1">静的型付けにより、コードの品質と保守性を高め、安定したサービス提供を可能にしています。</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Tailwind CSS</h4>
                  <p className="text-sm text-gray-600 mt-1">効率的でモダンなUIデザインをutility-firstのアプローチで構築し、直感的で使いやすいインターフェースを提供しています。</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">microCMS</h4>
                  <p className="text-sm text-gray-600 mt-1">ヘッドレスCMSを利用することで、コンテンツ管理の柔軟性を高め、迅速な情報更新を可能にしています。</p>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Vercel</h4>
                  <p className="text-sm text-gray-600 mt-1">Next.jsに最適化されたホスティングプラットフォームにより、グローバルに高速なコンテンツ配信を実現しています。</p>
                </div>
              </div>
            </section>

            {/* 利用上の注意点 */}
            <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-yellow-900 mb-4">⚠️ ご利用上の注意</h2>
              <ul className="space-y-3 text-yellow-800">
                <li>
                  <strong>情報の正確性について:</strong><br />
                  掲載内容には万全を期していますが、情報の正確性や完全性を保証するものではありません。最新かつ正確な情報は、IPA（情報処理推進機構）の公式サイト等でご確認ください。
                </li>
                <li>
                  <strong>学習の補助として:</strong><br />
                  当サイトはあくまで学習の補助（副読本）としてご利用ください。試験の合格を保証するものではありません。
                </li>
                <li>
                  <strong>免責事項:</strong><br />
                  当サイトの利用によって生じたいかなる損害についても、当方は一切の責任を負いません。あらかじめご了承ください。
                </li>
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}