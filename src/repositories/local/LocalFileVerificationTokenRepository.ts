import 'server-only'
import fs from 'fs/promises'
import path from 'path'
import type { VerificationToken, IVerificationTokenRepository } from '../interfaces/IAuthRepository'

const FILE_PATH = path.join(process.cwd(), 'data', 'azure-table-storage', 'verificationTokens.json')

export class LocalFileVerificationTokenRepository implements IVerificationTokenRepository {
  private async readAll(): Promise<VerificationToken[]> {
    try {
      const content = await fs.readFile(FILE_PATH, 'utf-8')
      const raw = JSON.parse(content) as Array<{ identifier: string; token: string; expires: string }>
      return raw.map((t) => ({ ...t, expires: new Date(t.expires) }))
    } catch {
      return []
    }
  }

  private async writeAll(tokens: VerificationToken[]): Promise<void> {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true })
    await fs.writeFile(FILE_PATH, JSON.stringify(tokens, null, 2), 'utf-8')
  }

  async findByIdentifierAndToken(identifier: string, token: string): Promise<VerificationToken | null> {
    const all = await this.readAll()
    return all.find((t) => t.identifier === identifier && t.token === token) ?? null
  }

  async create(token: VerificationToken): Promise<void> {
    const all = await this.readAll()
    all.push(token)
    await this.writeAll(all)
  }

  async delete(identifier: string, token: string): Promise<void> {
    const all = await this.readAll()
    await this.writeAll(all.filter((t) => !(t.identifier === identifier && t.token === token)))
  }
}
