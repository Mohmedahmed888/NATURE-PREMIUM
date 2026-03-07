import { AdminNavbar } from '@/components/AdminNavbar'
import { isAuthed } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminClient from './ui'

export default async function AdminPage() {
  if (!(await isAuthed())) redirect('/account')
  return (
    <div>
      <AdminNavbar />
      <main id="main-content" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mt-6 shadow-lg border border-stone-100 dark:border-slate-700">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Admin</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage products and orders.</p>
          <AdminClient />
        </div>
      </main>
    </div>
  )
}
