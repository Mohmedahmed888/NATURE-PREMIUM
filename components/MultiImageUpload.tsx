'use client'

import { useState, useRef } from 'react'
import { useToast } from '@/components/Toast'

function parseImages(val: string | string[] | null | undefined): string[] {
  if (Array.isArray(val)) return val.filter(Boolean)
  if (typeof val === 'string') {
    try {
      const arr = JSON.parse(val)
      return Array.isArray(arr) ? arr.filter((x: unknown) => typeof x === 'string') : val ? [val] : []
    } catch {
      return val ? [val] : []
    }
  }
  return []
}

export function MultiImageUpload({
  value,
  onChange,
  placeholder = 'Upload images or paste URL',
}: {
  value: string | string[]
  onChange: (urls: string[]) => void
  placeholder?: string
}) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState<'url' | 'upload'>('upload')
  const [urlInput, setUrlInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const images = parseImages(value)

  function addImage(url: string) {
    if (!url?.trim() || images.includes(url.trim())) return
    onChange([...images, url.trim()])
  }

  function removeImage(index: number) {
    const next = images.filter((_, i) => i !== index)
    onChange(next)
  }

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
        addImage(data.url)
        toast('Image uploaded')
      } else if (data.error === 'file_too_large') {
        toast('File too large (max 5MB)', 'error')
      } else if (data.error === 'invalid_type') {
        toast('Unsupported file type (jpeg, png, webp, gif)', 'error')
      } else if (data.error === 'blob_not_configured') {
        toast('Configure storage: Vercel → Storage → Create Blob', 'error')
        setMode('url')
      } else {
        toast('Upload failed. Use URL mode instead', 'error')
        setMode('url')
      }
    } catch {
      toast('Upload failed. Use URL mode and enter image link', 'error')
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
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`text-sm px-3 py-2 rounded-lg ${mode === 'url' ? 'bg-brand-100 text-brand-700' : 'bg-stone-100 text-slate-600'}`}
        >
          URL
        </button>
      </div>
      {mode === 'upload' ? (
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200 border-dashed text-slate-600 hover:bg-stone-100 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Add image'}
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-xl px-4 py-3 bg-stone-50 border border-stone-200"
          />
          <button
            type="button"
            onClick={() => { addImage(urlInput); setUrlInput('') }}
            disabled={!urlInput.trim()}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white font-medium disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover border border-stone-200" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                aria-label="حذف"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
