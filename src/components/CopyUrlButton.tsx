'use client'

import { useState } from 'react'

interface CopyUrlButtonProps {
  url: string
}

export default function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    if (isCopied) return

    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error('URLのコピーに失敗しました:', error)
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
        title="URLをコピー"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>

      {/* ▼▼▼ ここから変更 ▼▼▼ */}
      {isCopied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
          コピーしました！
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
      )}
      {/* ▲▲▲ ここまで変更 ▲▲▲ */}
    </div>
  )
}