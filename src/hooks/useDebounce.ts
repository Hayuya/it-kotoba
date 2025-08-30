'use client'

import { useState, useEffect } from 'react'

/**
 * 指定された値のデバウンス（遅延）されたバージョンを返します。
 * @param value デバウンスする値
 * @param delay 遅延時間 (ミリ秒)
 * @returns デバウンスされた値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // `delay`時間後に値を更新するタイマーを設定
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // valueまたはdelayが変更された場合、タイマーをクリアして再設定
    // これにより、ユーザーの入力中は処理が実行されない
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}