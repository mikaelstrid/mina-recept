import type { Ingredient } from '@/types/entities'

export interface IIngredientRepository {
  findAll(): Promise<Ingredient[]>
  findById(id: string): Promise<Ingredient | null>
  findByName(name: string): Promise<Ingredient | null>
  create(ingredient: Ingredient): Promise<void>
  update(ingredient: Ingredient): Promise<void>
  delete(id: string): Promise<void>
}
