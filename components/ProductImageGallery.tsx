'use client'

import { useState } from 'react'
import { OptimizedImage } from './OptimizedImage'

function parseImages(imageUrl: string, imageUrls: string | null | undefined): string[] {
  const main = imageUrl ? [imageUrl] : []
  let extra: string[] = []
  if (imageUrls) {
    try {
      const arr = JSON.parse(imageUrls)
      if (Array.isArray(arr)) extra = arr.filter((x: unknown) => typeof x === 'string')
    } catch { /* ignore */ }
  }
  return [...main, ...extra]
}

export function ProductImageGallery({
  imageUrl,
  imageUrls,
  alt,
}: {
  imageUrl: string
  imageUrls?: string | null
  alt: string
}) {
  const images = parseImages(imageUrl, imageUrls)
  const [selected, setSelected] = useState(0)

  if (images.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="relative aspect-square bg-stone-50 rounded-xl overflow-hidden">
        <OptimizedImage
          src={images[selected]!}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`shrink-0 w-14 h-14 min-w-[44px] min-h-[44px] rounded-lg overflow-hidden border-2 transition-colors ${
                selected === i ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
