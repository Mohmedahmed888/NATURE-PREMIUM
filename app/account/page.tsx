import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/user-auth'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { formatEGP } from '@/lib/money'
import { AccountAuth } from './AccountAuth'

export default async function AccountPage(props: { searchParams: Promise<{ err?: string }> }) {
  if (await isAuthed()) redirect('/admin')

  const user = await getCurrentUser()
  const { err } = await props.searchParams

  if (!user) {
    return (
      <div className="min-h-screen w-full grid grid-rows-[auto_1fr_auto]">
        <Navbar />
        <main id="main-content" className="w-full max-w-md mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">حسابي</h1>
          {err === '1' && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              البريد أو كلمة المرور غير صحيحة
            </div>
          )}
          {err === 'exists' && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 text-amber-700 text-sm">
              البريد الإلكتروني مسجل مسبقاً. جرّب تسجيل الدخول.
            </div>
          )}
          {err === 'password' && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 text-amber-700 text-sm">
              كلمة المرور يجب أن تكون 6 أحرف على الأقل
            </div>
          )}
          {err === 'rate' && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 text-amber-700 text-sm">
              محاولات كثيرة. انتظر دقيقة وحاول مرة أخرى.
            </div>
          )}
          <AccountAuth />
        </main>
        <Footer />
      </div>
    )
  }

  const orders = await prisma.order.findMany({
    where: { OR: [{ userId: user.id }, { email: user.email }] },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
    take: 20,
  })

  return (
    <div className="min-h-screen w-full grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      <main id="main-content" className="w-full max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">حسابي</h1>
          <form action="/api/account/logout" method="post">
            <button
              type="submit"
              className="text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              تسجيل الخروج
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 mb-8">
          <h2 className="font-semibold text-slate-800 mb-2">معلومات الحساب</h2>
          <p className="text-slate-600"><strong>الاسم:</strong> {user.name}</p>
          <p className="text-slate-600 mt-1"><strong>البريد:</strong> {user.email}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">طلباتي</h2>
          {orders.length === 0 ? (
            <p className="text-slate-500">لا توجد طلبات حتى الآن.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="border border-stone-100 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-800">
                        طلب #{o.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <span className="font-semibold text-brand-600">
                      {formatEGP(o.totalCents)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {o.items.map((i) => (
                      <span key={i.id}>
                        {i.product.name} × {i.qty}
                        {i !== o.items[o.items.length - 1] ? ' — ' : ''}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      o.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-700'
                        : o.status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {o.status === 'PENDING' && 'قيد الانتظار'}
                    {o.status === 'PAID' && 'تم الدفع'}
                    {o.status === 'SHIPPED' && 'تم الشحن'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
