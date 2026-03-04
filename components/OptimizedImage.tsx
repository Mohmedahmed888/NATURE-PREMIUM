'use client'

import Image from 'next/image'

export function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  sizes,
}: {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      sizes={sizes || (fill ? '(max-width: 768px) 100vw, 50vw' : undefined)}
      unoptimized={src.startsWith('http') && !src.includes('images.unsplash.com') && !src.includes('cloudinary.com')}
    />
  )
}
