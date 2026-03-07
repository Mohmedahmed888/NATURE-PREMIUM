'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/components/cart'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/#products', label: 'Products' },
    { href: '/#testimonials', label: 'Reviews' },
    { href: '/#blogs', label: 'Blog' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-stone-50/95 border-b border-stone-200/60 backdrop-blur-md">
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2">
          <Link href="/" className="font-brand font-normal text-xl text-slate-800 tracking-tight shrink-0">
            Nature&apos;s Premium
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href || (pathname === '/' && item.href === '/')
                    ? 'text-orange-500 border-b-2 border-orange-500 pb-0.5'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link
              href="/account"
              className="touch-target flex items-center justify-center p-2 -m-2 text-slate-600 hover:text-slate-900 active:text-slate-900 transition-colors rounded-lg"
              aria-label="My account"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link
              href="/cart"
              className="relative touch-target flex items-center justify-center p-2 -m-2 text-slate-600 hover:text-slate-900 active:text-slate-900 transition-colors rounded-lg"
              aria-label={totalItems > 0 ? `Cart — ${totalItems} items` : 'Cart'}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-orange-500 rounded-full">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden touch-target flex items-center justify-center p-2 -m-2 text-slate-600 hover:text-slate-900 active:text-slate-900 rounded-lg"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-stone-200 flex flex-col gap-2" role="navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm font-medium ${
                  pathname === item.href ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
