import 'server-only'
import type { User } from '@/types/entities'
import type { IUserRepository } from '../interfaces/IUserRepository'
import { LocalFileBase } from './LocalFileBase'

export class LocalFileUserRepository extends LocalFileBase<User> implements IUserRepository {
  constructor() {
    super('users.json')
  }

  async findByEmail(email: string): Promise<User | null> {
    const all = await this.readAll()
    return all.find((u) => u.emailAddress.toLowerCase() === email.toLowerCase()) ?? null
  }

  async findAll(): Promise<User[]> {
    return this.readAll()
  }
}
