import { Suspense } from 'react'
import { findRecipes } from '@/services/RecipeService'
import { categoryRepo, tagRepo } from '@/repositories/factory'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { RecipeCardSkeleton } from '@/components/recipe/RecipeCardSkeleton'
import { RecipeSearch } from '@/components/recipe/RecipeSearch'

const PAGE_SIZE = 12

interface SearchParams {
  q?: string
  categories?: string
  tags?: string
  page?: string
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const q = params.q ?? ''
  const categoryIds = params.categories ? params.categories.split(',').filter(Boolean) : []
  const tagIds = params.tags ? params.tags.split(',').filter(Boolean) : []
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  const [{ items: recipes, total, totalPages }, categories, tags] = await Promise.all([
    findRecipes({ searchText: q, categoryIds, tagIds }, { page, pageSize: PAGE_SIZE }),
    categoryRepo.findAll(),
    tagRepo.findAll(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Recept</h1>
        <p className="text-muted-foreground">
          {total === 0 ? 'Inga recept ännu' : `${total} recept`}
        </p>
      </div>

      <Suspense>
        <RecipeSearch
          categories={categories}
          tags={tags}
          initialQ={q}
          initialCategoryIds={categoryIds}
          initialTagIds={tagIds}
        />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <RecipeGrid
          recipes={recipes}
          emptyMessage={
            q || categoryIds.length || tagIds.length
              ? 'Inga recept matchar din sökning. Prova att rensa filtren.'
              : 'Inga recept ännu. Lägg till ditt första recept!'
          }
        />
      </Suspense>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1
            const newParams = new URLSearchParams({
              ...(q && { q }),
              ...(categoryIds.length && { categories: categoryIds.join(',') }),
              ...(tagIds.length && { tags: tagIds.join(',') }),
              page: String(p),
            })
            return (
              <a
                key={p}
                href={`/recipes?${newParams}`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors ${
                  p === page
                    ? 'bg-primary text-primary-foreground'
                    : 'border hover:bg-muted text-muted-foreground'
                }`}
              >
                {p}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
