'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setFeedbackMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFeedbackMessage('お問い合わせいただきありがとうございます。メッセージは正常に送信されました。')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setStatus('error')
        setFeedbackMessage(data.error || 'メッセージの送信に失敗しました。時間をおいて再度お試しください。')
      }
    } catch (error) {
      setStatus('error')
      setFeedbackMessage('ネットワークエラーが発生しました。時間をおいて再度お試しください。')
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">お名前<span className="text-red-500">*</span></label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          minLength={2}
          maxLength={50}
          className="input" 
          autoComplete="name"
          placeholder="山田 太郎"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス<span className="text-red-500">*</span></label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title="有効なメールアドレスを入力してください。"
          className="input" 
          autoComplete="email" 
          placeholder="example@email.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">お問い合わせ内容<span className="text-red-500">*</span></label>
        <textarea 
          id="message" 
          name="message" 
          rows={6} 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
          minLength={10}
          maxLength={1000}
          className="input"
          placeholder="例）IT言葉辞典のサイトについて、こんな機能があったら嬉しいです。..."
        ></textarea>
      </div>
      <div>
        <button type="submit" disabled={status === 'submitting'} className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
          {status === 'submitting' ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              送信中...
            </>
          ) : (
            '送信する'
          )}
        </button>
      </div>

      {status === 'success' && (
        <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg text-center">
          {feedbackMessage}
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-center">
          {feedbackMessage}
        </div>
      )}
    </form>
  )
}