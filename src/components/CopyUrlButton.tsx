'use client'

interface CopyUrlButtonProps {
  url: string
}

export default function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      // 成功時の視覚的フィードバック（オプション）
      // alert('URLをコピーしました')
    } catch (error) {
      console.error('URLのコピーに失敗しました:', error)
      // フォールバック: 選択可能なテキストフィールドを表示
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
      title="URLをコピー"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </button>
  )
}