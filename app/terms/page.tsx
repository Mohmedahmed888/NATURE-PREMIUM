import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions of use - NATURE PREMIUM',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      <main id="main-content" className="w-full max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-800">Terms & Conditions</h1>
        <p className="mt-4 text-slate-600">
          By using <span className="font-brand text-slate-800">NATURE PREMIUM</span>, you agree to these terms. Products are subject to
          availability. We commit to delivering your orders on time and reserve the right to cancel orders in
          exceptional cases.
        </p>
        <p className="mt-4 text-slate-600">
          For inquiries: info@naturalpremium.com
        </p>
      </main>
      <Footer />
    </div>
  )
}
