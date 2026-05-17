import 'server-only'
import { recipeRepo, ingredientRepo, tagRepo, categoryRepo } from '@/repositories/factory'
import { generateId, generateSlug } from '@/lib/utils'
import type { Recipe, User, Category, Tag } from '@/types/entities'
import type { CreateRecipeRequest, UpdateRecipeRequest } from '@/types/api'
import type { RecipeFilters, PaginationOptions, PaginatedResult } from '@/types/repository'

export async function findRecipes(
  filters: RecipeFilters,
  pagination: PaginationOptions
): Promise<PaginatedResult<Recipe>> {
  return recipeRepo.findMany(filters, pagination)
}

export async function findRecipeBySlug(slug: string): Promise<Recipe | null> {
  return recipeRepo.findBySlug(slug)
}

export async function findRecipeById(id: string): Promise<Recipe | null> {
  return recipeRepo.findById(id)
}

export async function createRecipe(data: CreateRecipeRequest, author: User): Promise<Recipe> {
  const categories = await Promise.all(
    data.categoryIds.map((id) => categoryRepo.findById(id))
  )
  const validCategories = categories.filter((c): c is Category => c !== null)

  const tags = await Promise.all(
    data.tagNames.map(async (name) => {
      let tag = await tagRepo.findByName(name)
      if (!tag) {
        tag = { id: generateId(), name }
        await tagRepo.create(tag)
      }
      return tag as Tag
    })
  )

  const ingredients = await Promise.all(
    data.ingredients.map(async ({ ingredientName, quantity }) => {
      let ingredient = await ingredientRepo.findByName(ingredientName)
      if (!ingredient) {
        ingredient = { id: generateId(), name: ingredientName }
        await ingredientRepo.create(ingredient)
      }
      return { ingredient, quantity }
    })
  )

  const baseSlug = generateSlug(data.title)
  const urlSlug = await ensureUniqueSlug(baseSlug)

  const recipe: Recipe = {
    id: generateId(),
    title: data.title,
    urlSlug,
    description: data.description,
    cookingTimeMinutes: data.cookingTimeMinutes,
    imageUrl: data.imageUrl || undefined,
    categories: validCategories,
    tags,
    ingredients,
    steps: data.steps.sort((a, b) => a.order - b.order),
    author,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await recipeRepo.create(recipe)
  return recipe
}

export async function updateRecipe(id: string, data: UpdateRecipeRequest): Promise<Recipe> {
  const existing = await recipeRepo.findById(id)
  if (!existing) throw new Error(`Recipe ${id} not found`)

  const categories = data.categoryIds
    ? (await Promise.all(data.categoryIds.map((cid) => categoryRepo.findById(cid)))).filter(
        (c): c is Category => c !== null
      )
    : existing.categories

  const tags = data.tagNames
    ? await Promise.all(
        data.tagNames.map(async (name) => {
          let tag = await tagRepo.findByName(name)
          if (!tag) {
            tag = { id: generateId(), name }
            await tagRepo.create(tag)
          }
          return tag as Tag
        })
      )
    : existing.tags

  const ingredients = data.ingredients
    ? await Promise.all(
        data.ingredients.map(async ({ ingredientName, quantity }) => {
          let ingredient = await ingredientRepo.findByName(ingredientName)
          if (!ingredient) {
            ingredient = { id: generateId(), name: ingredientName }
            await ingredientRepo.create(ingredient)
          }
          return { ingredient, quantity }
        })
      )
    : existing.ingredients

  const updated: Recipe = {
    ...existing,
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    cookingTimeMinutes: data.cookingTimeMinutes ?? existing.cookingTimeMinutes,
    imageUrl: data.imageUrl !== undefined ? data.imageUrl || undefined : existing.imageUrl,
    urlSlug: data.urlSlug ?? existing.urlSlug,
    categories,
    tags,
    ingredients,
    steps: data.steps ? data.steps.sort((a, b) => a.order - b.order) : existing.steps,
    updatedAt: new Date(),
  }

  await recipeRepo.update(updated)
  return updated
}

export async function archiveRecipe(id: string): Promise<void> {
  return recipeRepo.archive(id)
}

async function ensureUniqueSlug(base: string, attempt = 0): Promise<string> {
  const slug = attempt === 0 ? base : `${base}-${attempt + 1}`
  const existing = await recipeRepo.findBySlug(slug)
  if (!existing) return slug
  if (attempt >= 10) throw new Error(`Could not generate unique slug for "${base}"`)
  return ensureUniqueSlug(base, attempt + 1)
}
