import fs from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

const IMAGES_DIR = path.join(process.cwd(), 'data', 'azure-blob-storage', 'images')

const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const safe = path.basename(decodeURIComponent(filename))
  const filePath = path.join(IMAGES_DIR, safe)

  try {
    const buffer = await fs.readFile(filePath)
    const ext = safe.split('.').pop()?.toLowerCase() ?? ''
    const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream'
    return new Response(buffer, { headers: { 'Content-Type': contentType } })
  } catch {
    return NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
  }
}
