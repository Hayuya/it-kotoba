import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'

export const metadata: Metadata = {
  title: 'プライバシーポリシー - IT言葉辞典',
  description: 'IT言葉辞典（以下、「当サイト」といいます。）におけるプライバシー情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。',
  robots: {
    index: false, // 検索エンジンにインデックスさせない
    follow: false,
  },
}

export default async function PrivacyPolicyPage() {

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
                <li className="text-gray-800 font-medium">プライバシーポリシー</li>
              </ol>
            </nav>

            <article className="bg-white rounded-lg shadow-md p-8">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
                <p className="text-sm text-gray-500">最終更新日: 2024年8月28日</p>
              </header>

              <div className="prose max-w-none">
                <p>IT言葉辞典（以下、「当サイト」といいます。）は、当サイトの提供するサービスにおける、ユーザーの個人情報を含むプライバシー情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。</p>

                <h2 id="article-1">第1条（プライバシー情報）</h2>
                <p>プライバシー情報のうち「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報を指します。</p>
                <p>プライバシー情報のうち「履歴情報および特性情報」とは、上記に定める「個人情報」以外のものをいい、ご利用いただいたサービス、ご覧になったページ、ユーザーが検索された検索キーワード、ご利用日時、ご利用の方法、ご利用環境、郵便番号や性別、職業、年齢、ユーザーのIPアドレス、クッキー情報、位置情報、端末の個体識別情報などを指します。</p>

                <h2 id="article-2">第2条（プライバシー情報の収集方法）</h2>
                <p>当サイトは、ユーザーがお問い合わせフォームを利用する際に氏名、メールアドレスなどの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や、決済に関する情報を当サイトの提携先（情報提供元、広告主、広告配信先などを含みます。以下、｢提携先｣といいます。）などから収集することがあります。</p>
                <p>当サイトは、ユーザーについて、利用したサービスやソフトウエア、閲覧したページ、検索した検索キーワード、利用日時、利用方法、利用環境（携帯端末を通じてご利用の場合の当該端末の通信状態、利用に際しての各種設定情報なども含みます）、IPアドレス、クッキー情報、位置情報、端末の個体識別情報などの履歴情報および特性情報を、ユーザーが当サイトや提携先のサービスを利用しまたはページを閲覧する際に収集します。</p>

                <h2 id="article-3">第3条（個人情報を収集・利用する目的）</h2>
                <p>当サイトが個人情報を収集・利用する目的は、以下のとおりです。</p>
                <ol>
                  <li>ユーザーからのお問い合わせに対応するために、お問い合わせ内容やユーザーの連絡先情報などを利用する目的</li>
                  <li>上記の利用目的に付随する目的</li>
                </ol>

                <h2 id="article-4">第4条（個人情報の第三者提供）</h2>
                <p>当サイトは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。</p>
                <ol>
                  <li>法令に基づく場合</li>
                  <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                  <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                  <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                </ol>
                
                <h2 id="article-5">第5条（アクセス解析ツールについて）</h2>
                <p>当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関して、詳しくは<a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer">ここをクリック</a>してください。</p>
                
                <h2 id="article-6">第6条（プライバシーポリシーの変更）</h2>
                <p>本ポリシーの内容は、ユーザーに通知することなく、変更することができるものとします。</p>
                <p>当サイトが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。</p>
                
                <h2 id="article-7">第7条（お問い合わせ窓口）</h2>
                <p>本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。</p>
                <p>
                  <Link href="/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</Link>
                </p>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}