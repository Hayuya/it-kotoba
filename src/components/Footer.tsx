import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* サイト情報 */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2">
                <span className="text-xl font-bold">IT</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">IT言葉</h3>
                {/* ▼▼▼ 変更箇所 ▼▼▼ */}
                <p className="text-gray-400 text-sm">情報処理安全確保支援士から基礎IT用語まで</p>
                {/* ▲▲▲ 変更箇所 ▲▲▲ */}
              </div>
            </div>
            {/* ▼▼▼ 変更箇所 ▼▼▼ */}
            <p className="text-gray-300 mb-4 leading-relaxed">
              情報処理安全確保支援士試験対策を中心に、幅広いIT技術用語を解説する索引サイトです。
              試験範囲を網羅しつつ、基礎から応用まで分かりやすい解説であなたの学習をサポートします。
            </p>
            {/* ▲▲▲ 変更箇所 ▲▲▲ */}
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/it-aikotoba" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/it-aikotoba" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ナビゲーション */}
          <div>
            <h4 className="text-lg font-semibold mb-4">サイトマップ</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  用語一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  このサイトについて
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* リソース */}
          <div>
            <h4 className="text-lg font-semibold mb-4">学習リソース</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.jitec.ipa.go.jp/1_11seido/sc.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  IPA公式サイト
                </a>
              </li>
              <li>
                <Link href="/exam-info" className="text-gray-300 hover:text-white transition-colors">
                  試験情報
                </Link>
              </li>
              <li>
                <Link href="/past-questions" className="text-gray-300 hover:text-white transition-colors">
                  過去問題
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="text-gray-300 hover:text-white transition-colors">
                  用語集
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ボトムセクション */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>© {currentYear} IT言葉. All rights reserved.</p>
              {/* ▼▼▼ 変更箇所 ▼▼▼ */}
              <p className="mt-1">
                このサイトはIT技術の学習支援を目的としています。
              </p>
              {/* ▲▲▲ 変更箇所 ▲▲▲ */}
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                利用規約
              </Link>
              <Link href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors">
                サイトマップ
              </Link>
            </div>
          </div>
        </div>

        {/* 免責事項 */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>
            ※ 本サイトの情報は学習支援を目的としており、試験の合格を保証するものではありません。
            <br />
            最新の試験情報については、必ずIPA（情報処理推進機構）の公式サイトをご確認ください。
          </p>
        </div>
      </div>
    </footer>
  )
}