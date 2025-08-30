import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import { getCategories } from '../../lib/microcms'

export const metadata: Metadata = {
  title: 'このサイトについて - IT言葉',
  description: '「IT言葉」のコンセプトや、キーワード検索・索引機能の使い方について解説します。当サイトは情報処理安全確保支援士試験対策を主軸としつつ、より広い範囲のIT技術用語を網羅しています。',
  openGraph: {
    title: 'このサイトについて - IT言葉',
    description: '「IT言葉」のコンセプト、機能、使い方について',
  },
}

export default async function AboutPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー */}
          <aside className="lg:w-1/4">
            <IndexSidebar categories={categories} />
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
                「IT言葉」は、圧倒的な情報量と記憶に残る解説をコンセプトにした、情報処理技術者向けの用語学習サイトです。
                複雑な専門用語を、単なる暗記ではなく「理解」へと導くことを目的としています。
              </p>
            </header>

            {/* ▼▼▼【変更箇所】機能説明のセクションを全面的に刷新 ▼▼▼ */}
            <section className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">主な機能と使い方</h2>
              <div className="space-y-8">

                {/* キーワード検索 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    <Link href="/terms" className="hover:text-blue-600 transition-colors">
                      📚 キーワード検索と絞り込み
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">
                    目的の用語が明確な場合に最も効率的な検索方法です。「用語一覧」ページの上部にある検索ボックスから利用できます。
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                    <li>
                      <strong>半リアルタイム検索:</strong>
                      <p className="ml-4 mt-1">
                        入力が止まってから少し待つと、自動で検索が実行されます。ボタンを押す必要はありません。
                      </p>
                    </li>
                    <li>
                      <strong>高度な検索仕様:</strong>
                      <p className="ml-4 mt-1">
                        単なる文字の一致だけでなく、アルファベットの<strong>大文字・小文字</strong>、日本語の<strong>ひらがな・カタカナ</strong>を区別しない柔軟な検索が可能です。（例：「DNS」と入力しても「でぃーえぬえす」の用語がヒットします）
                      </p>
                    </li>
                     <li>
                      <strong>絞り込み機能:</strong>
                      <p className="ml-4 mt-1">
                        キーワード検索と合わせて、「カテゴリー」や「難易度」で結果をさらに絞り込むことができ、特定の分野やレベルに合わせた学習が可能です。
                      </p>
                    </li>
                  </ul>
                   <Link href="/terms" className="inline-block mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                    用語一覧ページで検索を使ってみる
                  </Link>
                </div>

                {/* 索引機能 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">🔍 索引（ABC・数字）</h3>
                  <p className="text-gray-600 mb-4">
                    サイドバーにある索引機能は、辞書のようにIT用語を探したい場合に便利です。アルファベットや数字のボタンをクリックすることで、該当する文字から始まる用語を素早く見つけ出せます。
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                    <li>
                      <strong>使い方:</strong>
                      <ol className="list-decimal list-inside ml-4 mt-1">
                        <li>サイドバーの「ABC」または「数字」ボタンで索引タイプを切り替えます。</li>
                        <li>表示されたアルファベットまたは「0-9」のボタンをクリックします。</li>
                        <li>クリックした文字で始まる用語の一覧が下に表示されます。</li>
                        <li>もう一度同じボタンをクリックすると、一覧は非表示になります。</li>
                      </ol>
                    </li>
                    <li>
                      <strong>リスト内検索:</strong>
                      <p className="ml-4 mt-1">
                        索引で表示された用語リストが長い場合は、リストの上部にある検索ボックスでさらに絞り込むことができます。
                      </p>
                    </li>
                  </ul>
                </div>

              </div>
            </section>
            {/* ▲▲▲【変更箇所】▲▲▲ */}
            
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
                  当サイトはあくまで学習の補助としてご利用ください。試験の合格を保証するものではありません。
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