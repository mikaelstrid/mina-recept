import 'server-only'
import type { Recipe } from '@/types/entities'
import type { IRecipeRepository } from '../interfaces/IRecipeRepository'
import type { RecipeFilters, PaginationOptions, PaginatedResult } from '@/types/repository'
import { LocalFileBase } from './LocalFileBase'

export class LocalFileRecipeRepository extends LocalFileBase<Recipe> implements IRecipeRepository {
  constructor() {
    super('recipes.json')
  }

  async findBySlug(slug: string): Promise<Recipe | null> {
    const all = await this.readAll()
    return all.find((r) => r.urlSlug === slug && !r.archivedAt) ?? null
  }

  async findMany(filters: RecipeFilters, pagination: PaginationOptions): Promise<PaginatedResult<Recipe>> {
    let all = await this.readAll()

    if (!filters.includeArchived) {
      all = all.filter((r) => !r.archivedAt)
    }

    if (filters.authorId) {
      all = all.filter((r) => r.author.id === filters.authorId)
    }

    if (filters.searchText) {
      const q = filters.searchText.toLowerCase()
      all = all.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.ingredient.name.toLowerCase().includes(q)) ||
          r.tags.some((t) => t.name.toLowerCase().includes(q))
      )
    }

    if (filters.categoryIds?.length) {
      all = all.filter((r) => r.categories.some((c) => filters.categoryIds!.includes(c.id)))
    }

    if (filters.tagIds?.length) {
      all = all.filter((r) => r.tags.some((t) => filters.tagIds!.includes(t.id)))
    }

    if (filters.ingredientIds?.length) {
      all = all.filter((r) =>
        r.ingredients.some((i) => filters.ingredientIds!.includes(i.ingredient.id))
      )
    }

    const total = all.length
    const totalPages = Math.ceil(total / pagination.pageSize)
    const items = all.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    )

    return { items, total, page: pagination.page, pageSize: pagination.pageSize, totalPages }
  }

  async countsByCategory(): Promise<Record<string, number>> {
    const all = (await this.readAll()).filter((r) => !r.archivedAt)
    const counts: Record<string, number> = {}
    for (const recipe of all) {
      for (const cat of recipe.categories) {
        counts[cat.id] = (counts[cat.id] ?? 0) + 1
      }
    }
    return counts
  }

  async countsByTag(): Promise<Record<string, number>> {
    const all = (await this.readAll()).filter((r) => !r.archivedAt)
    const counts: Record<string, number> = {}
    for (const recipe of all) {
      for (const tag of recipe.tags) {
        counts[tag.id] = (counts[tag.id] ?? 0) + 1
      }
    }
    return counts
  }

  async archive(id: string): Promise<void> {
    const all = await this.readAll()
    const index = all.findIndex((r) => r.id === id)
    if (index === -1) throw new Error(`Recipe ${id} not found`)
    all[index] = { ...all[index], archivedAt: new Date() }
    await this.writeAll(all)
  }

  async unarchive(id: string): Promise<void> {
    const all = await this.readAll()
    const index = all.findIndex((r) => r.id === id)
    if (index === -1) throw new Error(`Recipe ${id} not found`)
    const { archivedAt: _, ...rest } = all[index]
    all[index] = rest as Recipe
    await this.writeAll(all)
  }
}
