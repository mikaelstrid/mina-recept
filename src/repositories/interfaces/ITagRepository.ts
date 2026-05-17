import type { Tag } from '@/types/entities'

export interface ITagRepository {
  findAll(): Promise<Tag[]>
  findById(id: string): Promise<Tag | null>
  findByName(name: string): Promise<Tag | null>
  create(tag: Tag): Promise<void>
  update(tag: Tag): Promise<void>
  delete(id: string): Promise<void>
}
