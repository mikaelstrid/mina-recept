import 'server-only'
import type { Category } from '@/types/entities'
import type { ICategoryRepository } from '../interfaces/ICategoryRepository'
import { LocalFileBase } from './LocalFileBase'

export class LocalFileCategoryRepository extends LocalFileBase<Category> implements ICategoryRepository {
  constructor() {
    super('categories.json')
  }

  async findAll(): Promise<Category[]> {
    return this.readAll()
  }
}
