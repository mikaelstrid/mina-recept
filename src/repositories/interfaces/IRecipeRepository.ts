import type { Recipe } from '@/types/entities'
import type { RecipeFilters, PaginationOptions, PaginatedResult } from '@/types/repository'

export interface IRecipeRepository {
  findById(id: string): Promise<Recipe | null>
  findBySlug(slug: string): Promise<Recipe | null>
  findMany(filters: RecipeFilters, pagination: PaginationOptions): Promise<PaginatedResult<Recipe>>
  countsByCategory(): Promise<Record<string, number>>
  countsByTag(): Promise<Record<string, number>>
  create(recipe: Recipe): Promise<void>
  update(recipe: Recipe): Promise<void>
  archive(id: string): Promise<void>
  unarchive(id: string): Promise<void>
  delete(id: string): Promise<void>
}
