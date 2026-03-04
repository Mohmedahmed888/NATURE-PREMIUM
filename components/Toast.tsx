'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info' }

type ToastCtx = {
  toast: (message: string, type?: Toast['type']) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return
    const t = setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
    return () => clearTimeout(t)
  }, [toasts])

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 left-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto mx-auto max-w-md w-full px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-in slide-in-from-bottom-4 ${
              t.type === 'error' ? 'bg-red-500' : t.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useToast must be used within ToastProvider')
  return v
}
