import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "Privacy policy and data protection - Nature's Premium",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      <main id="main-content" className="w-full max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-800">Privacy Policy</h1>
        <p className="mt-4 text-slate-600">
          At <span className="font-brand text-slate-800">Nature&apos;s Premium</span> we respect your privacy. Data you provide when placing an order
          (name, email, address) is collected only for order processing and communication.
          We do not share your data with third parties for marketing.
        </p>
        <p className="mt-4 text-slate-600">
          For updates or inquiries, contact us at info@naturalpremium.com
        </p>
      </main>
      <Footer />
    </div>
  )
}
