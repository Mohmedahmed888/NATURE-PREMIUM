import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display } from 'next/font/google'
import { Providers } from './providers'
import { Background } from '@/components/Background'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-brand',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  title: {
    default: 'NATURE PREMIUM | منتجات طبيعية للعناية بالبشرة والشعر',
    template: '%s | NATURE PREMIUM',
  },
  description: 'متجر NATURE PREMIUM — منتجات طبيعية راقية للعناية بالبشرة والشعر. جل ألوفيرا، زيوت طبيعية، صابون يدوي، وسيروم بشرة.',
  keywords: ['منتجات طبيعية', 'ألوفيرا', 'زيت أرجان', 'صابون لافندر', 'عناية بالبشرة', 'NATURE PREMIUM'],
  authors: [{ name: 'NATURE PREMIUM' }],
  creator: 'NATURE PREMIUM',
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'NATURE PREMIUM',
    title: 'NATURE PREMIUM | منتجات طبيعية للعناية بالبشرة والشعر',
    description: 'منتجات طبيعية راقية للعناية بالبشرة والشعر.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NATURE PREMIUM | منتجات طبيعية',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    title: 'NATURE PREMIUM',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#7c3aed',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={playfair.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased w-full max-w-[100vw] overflow-x-hidden">
        <a
          href="#main-content"
          className="skip-link"
        >
          انتقل للمحتوى الرئيسي
        </a>
        <Background />
        <div className="min-w-0 w-full max-w-[100vw] overflow-x-hidden">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
