import 'server-only'
import type { Tag } from '@/types/entities'
import type { ITagRepository } from '../interfaces/ITagRepository'
import { LocalFileBase } from './LocalFileBase'

export class LocalFileTagRepository extends LocalFileBase<Tag> implements ITagRepository {
  constructor() {
    super('tags.json')
  }

  async findAll(): Promise<Tag[]> {
    return this.readAll()
  }

  async findByName(name: string): Promise<Tag | null> {
    const all = await this.readAll()
    return all.find((t) => t.name.toLowerCase() === name.toLowerCase()) ?? null
  }
}
