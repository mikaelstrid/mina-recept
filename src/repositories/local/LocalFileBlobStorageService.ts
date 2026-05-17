import 'server-only'
import fs from 'fs/promises'
import path from 'path'
import type { IBlobStorageService } from '../interfaces/IBlobStorageService'

const IMAGES_DIR = path.join(process.cwd(), 'data', 'azure-blob-storage', 'images')

export class LocalFileBlobStorageService implements IBlobStorageService {
  async upload(buffer: Buffer, filename: string, contentType: string): Promise<string> {
    await fs.mkdir(IMAGES_DIR, { recursive: true })
    const uniqueFilename = `${crypto.randomUUID()}-${filename}`
    await fs.writeFile(path.join(IMAGES_DIR, uniqueFilename), buffer)
    return uniqueFilename
  }

  async delete(filename: string): Promise<void> {
    try {
      await fs.unlink(path.join(IMAGES_DIR, filename))
    } catch {
      // File may not exist — treat as success
    }
  }

  getUrl(filename: string): string {
    return `/api/images/${encodeURIComponent(filename)}`
  }
}
