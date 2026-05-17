import 'server-only'
import type { Ingredient } from '@/types/entities'
import type { IIngredientRepository } from '../interfaces/IIngredientRepository'
import { LocalFileBase } from './LocalFileBase'

export class LocalFileIngredientRepository extends LocalFileBase<Ingredient> implements IIngredientRepository {
  constructor() {
    super('ingredients.json')
  }

  async findAll(): Promise<Ingredient[]> {
    return this.readAll()
  }

  async findByName(name: string): Promise<Ingredient | null> {
    const all = await this.readAll()
    return all.find((i) => i.name.toLowerCase() === name.toLowerCase()) ?? null
  }
}
