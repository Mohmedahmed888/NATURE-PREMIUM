import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display } from 'next/font/google'
import { Providers } from './providers'
import { Background } from '@/components/Background'
import { getSiteTheme } from '@/lib/site-theme'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-brand',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  title: {
    default: "Nature's Premium | Natural Skincare & Hair Care",
    template: "%s | Nature's Premium",
  },
  description: "Nature's Premium — Premium natural products for skin and hair care. Aloe gel, natural oils, handmade soap, serums.",
  keywords: ['natural products', 'aloe vera', 'argan oil', 'lavender soap', 'skincare', "Nature's Premium"],
  authors: [{ name: "Nature's Premium" }],
  creator: "Nature's Premium",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: "Nature's Premium",
    title: "Nature's Premium | Natural Skincare & Hair Care",
    description: 'Premium natural products for skin and hair care.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nature's Premium | Natural Products",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    title: "Nature's Premium",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getSiteTheme()
  return (
    <html lang="en" dir="ltr" className={`${playfair.variable} ${theme === 'dark' ? 'dark' : ''}`} suppressHydrationWarning>
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
