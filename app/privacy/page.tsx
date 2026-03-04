import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة الخصوصية وحماية البيانات - NATURE PREMIUM',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      <main id="main-content" className="w-full max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-800">سياسة الخصوصية</h1>
        <p className="mt-4 text-slate-600">
          نحن في <span className="font-brand text-slate-800">NATURE PREMIUM</span> نحترم خصوصيتك. يتم جمع البيانات التي تقدمها عند إتمام الطلب
          (الاسم، البريد الإلكتروني، العنوان) لأغراض معالجة الطلبات والتواصل معك فقط.
          لا نشارك بياناتك مع أطراف ثالثة لأغراض تسويقية.
        </p>
        <p className="mt-4 text-slate-600">
          للتحديثات أو الاستفسارات، تواصل معنا عبر info@naturalpremium.com
        </p>
      </main>
      <Footer />
    </div>
  )
}
