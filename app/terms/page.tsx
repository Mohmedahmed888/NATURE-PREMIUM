import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الشروط والأحكام',
  description: 'شروط وأحكام الاستخدام - NATURE PREMIUM',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full min-w-0 max-w-[100vw] overflow-x-hidden grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      <main id="main-content" className="w-full max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-800">الشروط والأحكام</h1>
        <p className="mt-4 text-slate-600">
          باستخدام موقع <span className="font-brand text-slate-800">NATURE PREMIUM</span>، فإنك توافق على هذه الشروط. المنتجات المعروضة تخضع
          للتوفر. نلتزم بتوصيل طلباتك في الوقت المحدد ونحتفظ بحق إلغاء الطلبات في حالات
          استثنائية.
        </p>
        <p className="mt-4 text-slate-600">
          للاستفسارات: info@naturalpremium.com
        </p>
      </main>
      <Footer />
    </div>
  )
}
