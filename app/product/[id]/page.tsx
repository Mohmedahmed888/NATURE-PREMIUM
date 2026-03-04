import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProductViewTracker } from '@/components/ProductViewTracker'
import { ProductImageGallery } from '@/components/ProductImageGallery'
import { prisma } from '@/lib/prisma'
import { formatEGP } from '@/lib/money'
import { ProductAddButton } from '@/components/ProductAddButton'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'

type Props = { params: Promise<{ id: string }> }

async function findProductBySlug(slug: string) {
  const trimmed = slug.trim()
  return prisma.product.findFirst({
    where: {
      OR: [
        { slug: trimmed },
        { slug: trimmed.replace(/\s+/g, '-') },
        { slug: trimmed.replace(/-/g, ' ') },
      ],
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await findProductBySlug(decodeURIComponent(id))
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | NATURE PREMIUM`,
      description: product.description,
      images: [product.imageUrl],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await findProductBySlug(decodeURIComponent(id))
  if (!product || !product.active) return notFound()

  const base = process.env.APP_URL || 'http://localhost:3000'
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl.startsWith('http') ? product.imageUrl : `${base}${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}`,
    offers: {
      '@type': 'Offer',
      price: product.priceCents / 100,
      priceCurrency: 'EGP',
    },
  }

  return (
    <div className="min-h-screen w-full grid grid-rows-[auto_1fr_auto]">
      <JsonLd data={productJsonLd} />
      <ProductViewTracker productId={product.id} />
      <Navbar />
      <main id="main-content" className="w-full mx-auto max-w-5xl px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden mt-6 shadow-xl border border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-stone-50 p-4 sm:p-6 md:min-h-[400px]">
              <ProductImageGallery imageUrl={product.imageUrl} imageUrls={product.imageUrls} alt={product.name} />
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="font-brand text-sm text-orange-500 font-semibold brand-text uppercase">NATURE PREMIUM</div>
              <h1 className="text-3xl font-extrabold mt-2 text-slate-800">{product.name}</h1>
              <div className="mt-3 text-brand-600 font-semibold">{formatEGP(product.priceCents)}</div>
              <p className="mt-5 text-slate-600 leading-relaxed">{product.description}</p>

              <div className="mt-8">
                <ProductAddButton
                  productId={product.id}
                  productName={product.name}
                  stock={product.stock ?? 999}
                />
              </div>

              <div className="mt-6 text-xs text-slate-500">
                الدفع كاش عند الاستلام — توصيل لجميع أنحاء مصر
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
