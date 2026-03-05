'use client'

import { useState, useRef } from 'react'
import { useToast } from '@/components/Toast'

export function ImageUploadInput({
  value,
  onChange,
  placeholder = 'رفع صورة أو لصق رابط',
  className = '',
}: {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  className?: string
}) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState<'url' | 'upload'>('upload')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.ok && data.url) {
        onChange(data.url)
        toast('تم رفع الصورة بنجاح')
      } else if (data.error === 'file_too_large') {
        toast('الملف كبير جداً (الحد 5 ميجا)', 'error')
      } else if (data.error === 'invalid_type') {
        toast('نوع الملف غير مدعوم (jpeg, png, webp, gif)', 'error')
      } else if (data.error === 'blob_not_configured') {
        toast('إعداد التخزين: من لوحة Vercel → Storage → أنشئ Blob واربطه بالمشروع', 'error')
        setMode('url')
      } else {
        toast('فشل رفع الصورة. استخدم وضع «رابط» كحل مؤقت', 'error')
        setMode('url')
      }
    } catch {
      toast('فشل رفع الصورة. استخدم وضع «رابط» وأدخل رابط الصورة من الإنترنت', 'error')
      setMode('url')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`text-sm px-3 py-2 rounded-lg ${mode === 'upload' ? 'bg-brand-100 text-brand-700' : 'bg-stone-100 text-slate-600'}`}
        >
          رفع صورة
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`text-sm px-3 py-2 rounded-lg ${mode === 'url' ? 'bg-brand-100 text-brand-700' : 'bg-stone-100 text-slate-600'}`}
        >
          رابط
        </button>
      </div>
      {mode === 'upload' ? (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200 border-dashed text-slate-600 hover:bg-stone-100 disabled:opacity-50"
          >
            {uploading ? 'جاري الرفع...' : 'اختر صورة أو اسحبها هنا'}
          </button>
          {value && (
            <div className="mt-2 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="h-12 w-12 rounded object-cover" />
              <span className="text-xs text-slate-500 truncate flex-1">{value}</span>
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange('') }} className="text-red-500 text-sm hover:underline">إزالة</button>
            </div>
          )}
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200 ${className}`}
        />
      )}
    </div>
  )
}
