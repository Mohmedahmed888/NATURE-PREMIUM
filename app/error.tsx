'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-slate-800">Something went wrong</h2>
        <p className="text-slate-600 mt-2">
          Sorry, an unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-8 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
