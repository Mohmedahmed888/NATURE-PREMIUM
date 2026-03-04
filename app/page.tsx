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
    name: 'NATURE PREMIUM',
    url: base,
    description: 'متجر منتجات طبيعية للعناية بالبشرة والشعر',
  }

  return (
    <div className="min-h-screen w-full min-w-0 max-w-[100vw] overflow-x-hidden grid grid-rows-[auto_1fr_auto]">
      <JsonLd data={jsonLd} />
      <Navbar />

      <main id="main-content" className="w-full min-h-0 flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] w-full flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20" style={{ marginInline: 'auto' }}>
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 min-w-0 order-2 lg:order-1 text-center lg:text-right">
            <span className="inline-block text-sm font-semibold text-orange-500 tracking-widest uppercase mb-3">
              منتجات طبيعية
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              منتجات طبيعية للعناية بالبشرة والشعر
            </h1>
            <p className="mt-6 text-slate-600 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed">
              مستوحاة من أفضل المكونات الطبيعية، منتجاتنا تجمع بين الجودة والنتائج المضمونة.
              ترطيب عميق ونتائج مضمونة.
            </p>
            <Link
              href={heroProduct ? `/product/${heroProduct.slug}` : '/#products'}
              className="inline-flex items-center justify-center mt-8 px-8 py-4 min-h-[48px] rounded-2xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold transition-colors shadow-lg shadow-brand-500/25"
            >
              تسوق الآن
            </Link>
          </div>

          <div className="flex-1 min-w-0 relative order-1 lg:order-2 flex justify-center">
            {/* Decorative star */}
            <div className="absolute top-4 right-8 lg:right-16 w-12 h-12 text-orange-400/80">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" />
              </svg>
            </div>

            {/* Product image area */}
            <div className="relative flex justify-center items-center">
              {heroProduct ? (
                <div className="relative">
                  <div className="w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 mx-auto bg-white/60 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden border border-stone-200/50 relative">
                    <OptimizedImage src={heroProduct.imageUrl} alt={heroProduct.name} fill className="object-contain p-4" sizes="256px" />
                  </div>

                  {/* Testimonial card - top */}
                  <div className="absolute -top-2 -left-4 md:-left-8 bg-white rounded-2xl shadow-lg p-3 border border-stone-100 max-w-[180px]">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-200 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-slate-800">عميل سعيد</p>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial card - bottom */}
                  <div className="absolute -bottom-4 -right-2 md:-right-6 bg-white rounded-2xl shadow-lg p-4 border border-stone-100 max-w-[200px]">
                    <p className="text-xs text-slate-500 mb-1">عملاؤنا السعداء</p>
                    <div className="flex -space-x-2 mb-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-stone-300 border-2 border-white"
                        />
                      ))}
                    </div>
                    <p className="font-bold text-slate-800">4.9</p>
                    <p className="text-xs text-slate-500">(2568 تقييم)</p>
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                  </div>
                </div>
              ) : (
                <div className="w-64 h-80 bg-white/60 rounded-3xl shadow-xl flex items-center justify-center border border-stone-200/50">
                  <p className="text-slate-400">لا يوجد منتجات</p>
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

        {/* About Section */}
        <section id="about" className="py-20 lg:py-28 bg-stone-50/50 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 order-2 lg:order-1">
                <div className="w-full h-72 lg:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-orange-100 to-brand-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-40 bg-white/80 rounded-2xl shadow-lg" />
                    <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/60 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 lg:order-2">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-700">
                  من نحن
                </h2>
                <p className="mt-6 text-slate-600 text-lg leading-relaxed font-brand">
                  <span className="text-slate-800">NATURE PREMIUM</span> متخصصون في المنتجات الطبيعية للعناية بالبشرة والشعر منذ سنوات.
                  نؤمن بأن الجودة لا تساوم عليها، وكل منتج نقدمه مختار بعناية ليكون الأفضل
                  لك ولعائلتك.
                </p>
                <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                  من زيوت طبيعية إلى جل الألوفيرا وصابون اللافندر، نقدم تشكيلة متنوعة
                  تجمع بين الطبيعة والرفاهية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 lg:py-28 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">المنتجات</h2>
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                تصفح تشكيلتنا من المنتجات الطبيعية والعناية بالبشرة
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
                <p className="text-slate-500 mb-6">لا توجد منتجات حالياً</p>
                <form action="/api/seed" method="post">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium"
                  >
                    إضافة منتجات للبداية
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 lg:py-28 bg-stone-50/50 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">آراء عملائنا</h2>
              <p className="mt-4 text-slate-600">ماذا يقولون عن منتجاتنا</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'سارة م.', text: 'منتجات رائعة وجودة عالية. أنصح بها بشدة!', rating: 5 },
                { name: 'أحمد ك.', text: 'جل الألوفيرا ممتاز للبشرة. استخدمته ولاحظت الفرق.', rating: 5 },
                { name: 'فاطمة ع.', text: 'التوصيل سريع والمنتجات كما هو موصوف. شكراً لكم.', rating: 5 },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100"
                >
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <span key={j}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4">&quot;{t.text}&quot;</p>
                  <p className="font-semibold text-slate-800">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 lg:py-28 bg-stone-50/50 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginInline: 'auto' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">تواصل معنا</h2>
              <p className="mt-4 text-slate-600">نستقبل استفساراتك وطلباتك</p>
              <p className="mt-2 text-brand-600 font-medium">info@naturalpremium.com</p>
            </div>
          </div>
        </section>

        {/* FAQ & Shipping */}
        <section id="faq" className="py-12 bg-stone-50/30 scroll-mt-20 w-full">
          <div className="max-w-3xl mx-auto px-4 w-full" style={{ marginInline: 'auto' }}>
            <h2 className="text-xl font-bold text-slate-800 mb-4">الأسئلة الشائعة</h2>
            <p className="text-slate-600 text-sm">للاستفسارات تواصل معنا على info@naturalpremium.com</p>
          </div>
        </section>
        <section id="shipping" className="py-12 bg-stone-50/30 scroll-mt-20 w-full">
          <div className="max-w-3xl mx-auto px-4 w-full" style={{ marginInline: 'auto' }}>
            <h2 className="text-xl font-bold text-slate-800 mb-4">الشحن والتوصيل</h2>
            <p className="text-slate-600 text-sm">نوصل لجميع أنحاء مصر. التوصيل خلال 2-5 أيام عمل.</p>
          </div>
        </section>

        {/* Blogs placeholder */}
        <section id="blogs" className="py-16 lg:py-24 w-full flex-1 min-h-[200px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ marginInline: 'auto' }}>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">المدونة</h2>
              <p className="mt-4 text-slate-600">نصائح ووصفات طبيعية قريباً</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
