import { adminLoginAction } from './actions'
import { BrandMark } from '@/components/BrandMark'
import Link from 'next/link'

export default async function AdminLoginPage(props: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await props.searchParams
  const hasErr = err === '1'

  return (
    <main id="main-content" className="min-h-[100dvh] grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-start">
          <Link href="/">
            <BrandMark />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-stone-100">
          <h1 className="text-2xl font-extrabold text-slate-800">لوحة التحكم</h1>
          <p className="text-slate-600 mt-2">تسجيل دخول المسؤول (Admin)</p>

          <form action={adminLoginAction} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-600">البريد الإلكتروني</label>
              <input
                name="email"
                type="email"
                defaultValue="admin@gmail.com"
                placeholder="admin@gmail.com"
                className="w-full rounded-2xl px-4 py-3 bg-stone-50 border border-stone-200 text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-600">كلمة المرور</label>
              <input
                name="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="w-full rounded-2xl px-4 py-3 bg-stone-50 border border-stone-200 text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                required
              />
            </div>

            {hasErr && <div className="text-red-500 text-sm">البريد أو كلمة المرور غير صحيحة</div>}

            <button className="w-full rounded-2xl px-4 py-3 font-bold bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white">
              دخول
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/" className="hover:text-brand-600">← العودة للموقع</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
