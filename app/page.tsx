import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { OptimizedImage } from '@/components/OptimizedImage'
import { JsonLd } from '@/components/JsonLd'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Page() {
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = []
  try {
    products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch { /* DB not ready on Vercel build */ }
  const heroProduct = products[0]

  const base = process.env.APP_URL || 'http://localhost:3000'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Nature's Premium",
    url: base,
    description: 'Premium natural products for skin and hair care',
  }

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip grid grid-rows-[auto_1fr_auto]">
      <JsonLd data={jsonLd} />
      <Navbar />

      <main id="main-content" className="w-full min-h-0 flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-x-clip">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20" style={{ marginInline: 'auto' }}>
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-w-0">
          <div className="flex-1 min-w-0 order-2 lg:order-1 text-center lg:text-left">
            <span className="inline-block text-sm font-semibold text-orange-500 tracking-widest uppercase mb-3">
              Natural Products
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Natural Skincare & Hair Care
            </h1>
            <p className="mt-6 text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed">
              Inspired by the finest natural ingredients. Our products combine quality with guaranteed results — deep moisturizing and proven effectiveness.
            </p>
            <Link
              href={heroProduct ? `/product/${heroProduct.slug}` : '/#products'}
              className="inline-flex items-center justify-center mt-8 px-8 py-4 min-h-[48px] rounded-2xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold transition-colors shadow-lg shadow-brand-500/25"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex-1 min-w-0 relative order-1 lg:order-2 flex justify-center">
            {/* Decorative star */}
            <div className="absolute top-4 left-8 lg:left-16 w-12 h-12 text-orange-400/80">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" />
              </svg>
            </div>

            {/* Product image area */}
            <div className="relative flex justify-center items-center min-w-0 overflow-hidden">
              {heroProduct ? (
                <div className="relative max-w-full">
                  <div className="w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 mx-auto bg-white/60 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden border border-stone-200/50 relative">
                    <OptimizedImage src={heroProduct.imageUrl} alt={heroProduct.name} fill className="object-contain p-4" sizes="256px" />
                  </div>

                  {/* Testimonial card - top */}
                  <div className="absolute -top-2 -right-4 md:-right-8 bg-white rounded-2xl shadow-lg p-3 border border-stone-100 max-w-[180px]">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-200 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-slate-800">Happy Customer</p>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial card - bottom */}
                  <div className="absolute -bottom-4 -left-2 md:-left-6 bg-white rounded-2xl shadow-lg p-4 border border-stone-100 max-w-[200px]">
                    <p className="text-xs text-slate-500 mb-1">Our Happy Customers</p>
                    <div className="flex -space-x-2 mb-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-stone-300 border-2 border-white"
                        />
                      ))}
                    </div>
                    <p className="font-bold text-slate-800">4.9</p>
                    <p className="text-xs text-slate-500">(2568 reviews)</p>
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                  </div>
                </div>
              ) : (
                <div className="w-64 h-80 bg-white/60 rounded-3xl shadow-xl flex items-center justify-center border border-stone-200/50">
                  <p className="text-slate-400">No products</p>
                </div>
              )}
            </div>
          </div>
            </div>
          </div>
        </section>

        {/* Curved orange divider */}
        <div className="relative w-full overflow-hidden" style={{ height: '120px' }}>
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 Q360,0 720,60 T1440,120 L1440,120 L0,120 Z"
              fill="#f97316"
              fillOpacity="0.15"
            />
            <path
              d="M0,120 Q400,20 800,80 T1440,120 L1440,120 L0,120 Z"
              fill="#f97316"
              fillOpacity="0.25"
            />
          </svg>
        </div>

        {/* Products Section */}
        <section id="products" className="py-20 lg:py-28 w-full dark:bg-slate-900/30">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Products</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Browse our collection of natural skincare products
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  p={{
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    description: p.description,
                    priceCents: p.priceCents,
                    imageUrl: p.imageUrl,
                    stock: p.stock ?? 999,
                  }}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-600 mb-2">No products available at the moment</p>
                <p className="text-slate-500 text-sm">Contact us at info@naturalpremium.com or check back soon</p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 lg:py-28 bg-stone-50/50 dark:bg-slate-800/50 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Customer Reviews</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">What our customers say about us</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Sarah M.', text: 'Amazing products and great quality. Highly recommend!', rating: 5 },
                { name: 'Alex K.', text: 'The aloe gel is fantastic for my skin. I noticed the difference right away.', rating: 5 },
                { name: 'Emma L.', text: 'Fast delivery and products exactly as described. Thank you!', rating: 5 },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-stone-100 dark:border-slate-700"
                >
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <span key={j}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">&quot;{t.text}&quot;</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 lg:py-28 bg-stone-50/50 dark:bg-slate-800/50 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Contact Us</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">We welcome your inquiries and orders</p>
              <p className="mt-2 text-brand-600 font-medium">info@naturalpremium.com</p>
            </div>
          </div>
        </section>

        {/* FAQ & Shipping */}
        <section id="faq" className="py-12 bg-stone-50/30 dark:bg-slate-800/30 scroll-mt-20 w-full">
          <div className="max-w-3xl mx-auto px-4 w-full" style={{ marginInline: 'auto' }}>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">FAQ</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">For inquiries, contact us at info@naturalpremium.com</p>
          </div>
        </section>
        <section id="shipping" className="py-12 bg-stone-50/30 dark:bg-slate-800/30 scroll-mt-20 w-full">
          <div className="max-w-3xl mx-auto px-4 w-full" style={{ marginInline: 'auto' }}>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Shipping & Delivery</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">We ship nationwide. Delivery within 2-5 business days.</p>
          </div>
        </section>

        {/* Blogs placeholder */}
        <section id="blogs" className="py-16 lg:py-24 w-full flex-1 min-h-[200px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ marginInline: 'auto' }}>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Blog</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Natural tips and recipes — coming soon</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 w-full border-t border-stone-200 dark:border-slate-700">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Free Shipping</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Enjoy free shipping for orders above 5000 EGP and same day delivery for orders in New Cairo.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Original Products</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Our products are 100% original, using carefully selected natural ingredients and produced with the highest quality standards.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Support Online</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  We support customers 24/7. Send your questions and we will solve them for you immediately.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
