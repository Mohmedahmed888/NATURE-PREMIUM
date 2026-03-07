'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
export function AdminNavbar() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/admin"
              className={`font-bold text-lg ${pathname === '/admin' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Products
            </Link>
            <Link
              href="/admin/coupons"
              className={`text-sm ${pathname === '/admin/coupons' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Coupons
            </Link>
            <Link href="/" className="text-sm text-slate-300 hover:text-white">
              Website
            </Link>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
