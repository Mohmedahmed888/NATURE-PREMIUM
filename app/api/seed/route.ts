import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const count = await prisma.product.count()
  if (count > 0) return NextResponse.json({ ok: true, already: true })

  const products = [
    { slug: 'pure-aloe-gel', name: 'Pure Aloe Gel', description: 'جل ألوفيرا نقي للترطيب والتهدئة. مناسب للبشرة والشعر.', priceCents: 14900, imageUrl: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=60', stock: 50 },
    { slug: 'argan-oil', name: 'Cold-Pressed Argan Oil', description: 'زيت أرجان معصور على البارد. لمعان للشعر وترطيب عميق.', priceCents: 21900, imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=60', stock: 30 },
    { slug: 'lavender-soap', name: 'Lavender Handmade Soap', description: 'صابون يدوي برائحة اللافندر. لطيف على البشرة اليومية.', priceCents: 8900, imageUrl: 'https://images.unsplash.com/photo-1615486364489-9df3a57e7269?auto=format&fit=crop&w=1200&q=60', stock: 100 },
    { slug: 'green-tea-serum', name: 'Green Tea Face Serum', description: 'سيروم شاي أخضر مضاد للأكسدة. خفيف وسريع الامتصاص.', priceCents: 27900, imageUrl: 'https://images.unsplash.com/photo-1611930022211-4629e36c97fd?auto=format&fit=crop&w=1200&q=60', stock: 25 },
  ]

  await prisma.product.createMany({ data: products })
  return NextResponse.json({ ok: true, created: products.length })
}
