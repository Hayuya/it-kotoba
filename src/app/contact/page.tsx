import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import IndexSidebar from '../../components/IndexSidebar'
import { getCategories } from '../../lib/microcms'
import ContactForm from '../../components/ContactForm'

export const metadata: Metadata = {
  title: 'お問い合わせ - IT言葉辞典',
  description: 'IT言葉辞典に関するご意見、ご要望、誤りのご指摘などはこちらからお問い合わせください。',
  robots: {
    index: false,
  },
}

export default async function ContactPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <IndexSidebar categories={categories} />
          </aside>
          <main className="lg:w-3/4">
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li><Link href="/" className="hover:text-blue-600">ホーム</Link></li>
                <li>/</li>
                <li className="text-gray-800 font-medium">お問い合わせ</li>
              </ol>
            </nav>
            <div className="bg-white rounded-lg shadow-md p-8">
              <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">お問い合わせ</h1>
                <p className="text-gray-600">ご意見・ご要望、誤りのご指摘など、お気軽にご連絡ください。</p>
              </header>
              <ContactForm />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}