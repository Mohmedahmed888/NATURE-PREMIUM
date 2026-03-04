import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { isAuthed } from '@/lib/auth'
import sharp from 'sharp'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_WIDTH = 1200

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file || !file.size) {
      return NextResponse.json({ ok: false, error: 'no_file' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: 'file_too_large' }, { status: 400 })
    }

    const mime = file.type || ''
    if (!ALLOWED_TYPES.includes(mime)) {
      return NextResponse.json({ ok: false, error: 'invalid_type' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let outputBuffer: Buffer
    try {
      const image = sharp(buffer)
      const meta = await image.metadata()
      const width = meta.width || 0
      const needsResize = width > MAX_WIDTH

      outputBuffer = await image
        .resize(needsResize ? MAX_WIDTH : undefined)
        .webp({ quality: 85 })
        .toBuffer()
    } catch {
      outputBuffer = buffer
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, outputBuffer)

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ ok: false, error: 'upload_failed' }, { status: 500 })
  }
}
