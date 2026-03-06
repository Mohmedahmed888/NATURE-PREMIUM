'use client'

import { useState } from 'react'

export function AccountAuth() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8">
      <div className="flex gap-4 mb-6 border-b border-stone-200">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`pb-3 font-medium ${
            mode === 'login'
              ? 'text-brand-600 border-b-2 border-brand-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`pb-3 font-medium ${
            mode === 'register'
              ? 'text-brand-600 border-b-2 border-brand-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Create Account
        </button>
      </div>

      {mode === 'login' ? (
        <form action="/api/account/login" method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold"
          >
            Login
          </button>
        </form>
      ) : (
        <form action="/api/account/register" method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200"
            />
            <p className="text-xs text-slate-500 mt-1">6 أحرف على الأقل</p>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold"
          >
            Create Account
          </button>
        </form>
      )}
    </div>
  )
}
