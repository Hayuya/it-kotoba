import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import { getCategories } from '../../lib/microcms'

export const metadata: Metadata = {
  title: '利用規約 - IT言葉辞典',
  description: 'IT言葉辞典（以下、「当サイト」といいます。）の利用規約を掲載しています。',
  robots: {
    index: false, // 検索エンジンにインデックスさせない
    follow: false,
  },
}

export default async function TermsOfServicePage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
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
                <li className="text-gray-800 font-medium">利用規約</li>
              </ol>
            </nav>

            <article className="bg-white rounded-lg shadow-md p-8">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">利用規約</h1>
                <p className="text-sm text-gray-500">施行日: 2024年8月28日</p>
              </header>

              <div className="prose max-w-none">
                <p>この利用規約（以下、「本規約」といいます。）は、IT言葉辞典（以下、「当サイト」といいます。）がこのウェブサイト上で提供するサービスの利用条件を定めるものです。ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。</p>
                
                <h2 id="article-1">第1条（適用）</h2>
                <p>本規約は、ユーザーと当サイトとの間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>

                <h2 id="article-2">第2条（禁止事項）</h2>
                <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                <ol>
                    <li>法令または公序良俗に違反する行為</li>
                    <li>犯罪行為に関連する行為</li>
                    <li>当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                    <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
                    <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                    <li>他のユーザーに成りすます行為</li>
                    <li>当サイトのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                    <li>その他、当サイトが不適切と判断する行為</li>
                </ol>

                <h2 id="article-3">第3条（著作権）</h2>
                <p>当サイトに掲載されている情報についての著作権は放棄しておりません。著作権法により認められている引用の範囲である場合を除き「内容、テキスト、画像等」の無断転載・使用を固く禁じます。</p>

                <h2 id="article-4">第4条（免責事項）</h2>
                <p>当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。</p>
                <p>当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</p>
                <p>当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。</p>
                
                <h2 id="article-5">第5条（サービス内容の変更等）</h2>
                <p>当サイトは、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。</p>
                
                <h2 id="article-6">第6条（利用規約の変更）</h2>
                <p>当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</p>
                
                <h2 id="article-7">第7条（準拠法・裁判管轄）</h2>
                <p>本規約の解釈にあたっては、日本法を準拠法とします。</p>
                <p>本サービスに関して紛争が生じた場合には、当サイトの所在地を管轄する裁判所を専属的合意管轄とします。</p>
                
                <p className="text-right">以上</p>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}