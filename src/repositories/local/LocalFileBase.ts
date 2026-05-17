import 'server-only'
import fs from 'fs/promises'
import path from 'path'

const DATE_FIELD_PATTERN = /At$|^(createdAt|updatedAt|archivedAt|expiresAt|expires)$/

// Per-file async mutex to prevent interleaved reads/writes
const locks = new Map<string, Promise<void>>()

async function withLock<T>(filePath: string, fn: () => Promise<T>): Promise<T> {
  const current = locks.get(filePath) ?? Promise.resolve()
  let release!: () => void
  const next = new Promise<void>((resolve) => {
    release = resolve
  })
  locks.set(filePath, current.then(() => next))
  await current
  try {
    return await fn()
  } finally {
    release()
  }
}

function reviveDates(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(reviveDates)

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === 'string' && DATE_FIELD_PATTERN.test(key)) {
      result[key] = new Date(value)
    } else if (typeof value === 'object') {
      result[key] = reviveDates(value)
    } else {
      result[key] = value
    }
  }
  return result
}

export abstract class LocalFileBase<T extends { id: string }> {
  protected readonly filePath: string

  constructor(filename: string) {
    const dataDir = path.join(process.cwd(), 'data', 'azure-table-storage')
    this.filePath = path.join(dataDir, filename)
  }

  protected async readAll(): Promise<T[]> {
    return withLock(this.filePath, async () => {
      try {
        const content = await fs.readFile(this.filePath, 'utf-8')
        return reviveDates(JSON.parse(content)) as T[]
      } catch {
        return []
      }
    })
  }

  protected async writeAll(items: T[]): Promise<void> {
    return withLock(this.filePath, async () => {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true })
      await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), 'utf-8')
    })
  }

  async findById(id: string): Promise<T | null> {
    const all = await this.readAll()
    return all.find((item) => item.id === id) ?? null
  }

  async create(item: T): Promise<void> {
    const all = await this.readAll()
    all.push(item)
    await this.writeAll(all)
  }

  async update(item: T): Promise<void> {
    const all = await this.readAll()
    const index = all.findIndex((i) => i.id === item.id)
    if (index === -1) throw new Error(`Item with id ${item.id} not found`)
    all[index] = item
    await this.writeAll(all)
  }

  async delete(id: string): Promise<void> {
    const all = await this.readAll()
    await this.writeAll(all.filter((item) => item.id !== id))
  }
}
