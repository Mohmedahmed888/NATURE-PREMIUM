import { AdminNavbar } from '@/components/AdminNavbar'
import { isAuthed } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminCouponsClient from './AdminCouponsClient'

export default async function AdminCouponsPage() {
  if (!(await isAuthed())) redirect('/admin/login')

  return (
    <div>
      <AdminNavbar />
      <main id="main-content" className="mx-auto max-w-4xl px-4 pb-16 pt-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100">
          <h1 className="text-2xl font-extrabold text-slate-800">Coupon Codes</h1>
          <p className="text-slate-600 mt-2">Create and manage discount codes for customers</p>
          <AdminCouponsClient />
        </div>
      </main>
    </div>
  )
}
