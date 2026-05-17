import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { blobStorage } from '@/repositories/factory'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Ej inloggad', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Ingen fil angiven', code: 'BAD_REQUEST' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Filtypen stöds inte. Använd JPEG, PNG eller WebP.', code: 'INVALID_FILE_TYPE' },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Filen är för stor. Max 5 MB.', code: 'FILE_TOO_LARGE' },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = await blobStorage.upload(buffer, file.name, file.type)
  const url = blobStorage.getUrl(filename)

  return NextResponse.json({ url })
}
