import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL || 'https://nature-premium.vercel.app'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/cart`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/checkout`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/account`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    })
    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
    return [...staticPages, ...productPages]
  } catch {
    return staticPages
  }
}
