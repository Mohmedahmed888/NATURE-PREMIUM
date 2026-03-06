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
    default: 'NATURE PREMIUM | Natural Skincare & Hair Care',
    template: '%s | NATURE PREMIUM',
  },
  description: 'NATURE PREMIUM — Premium natural products for skin and hair care. Aloe gel, natural oils, handmade soap, serums.',
  keywords: ['natural products', 'aloe vera', 'argan oil', 'lavender soap', 'skincare', 'NATURE PREMIUM'],
  authors: [{ name: 'NATURE PREMIUM' }],
  creator: 'NATURE PREMIUM',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NATURE PREMIUM',
    title: 'NATURE PREMIUM | Natural Skincare & Hair Care',
    description: 'Premium natural products for skin and hair care.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NATURE PREMIUM | Natural Products',
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
    <html lang="en" dir="ltr" className={playfair.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased w-full max-w-full overflow-x-clip">
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        <Background />
        <div className="min-w-0 w-full max-w-full overflow-x-clip">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
