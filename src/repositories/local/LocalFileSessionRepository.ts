import 'server-only'
import type { AuthSession, ISessionRepository } from '../interfaces/IAuthRepository'
import { LocalFileBase } from './LocalFileBase'

export class LocalFileSessionRepository
  extends LocalFileBase<AuthSession>
  implements ISessionRepository
{
  constructor() {
    super('sessions.json')
  }

  async findByToken(sessionToken: string): Promise<AuthSession | null> {
    const all = await this.readAll()
    return all.find((s) => s.sessionToken === sessionToken) ?? null
  }

  async deleteByUserId(userId: string): Promise<void> {
    const all = await this.readAll()
    await this.writeAll(all.filter((s) => s.userId !== userId))
  }

  async delete(sessionToken: string): Promise<void> {
    const all = await this.readAll()
    await this.writeAll(all.filter((s) => s.sessionToken !== sessionToken))
  }
}
