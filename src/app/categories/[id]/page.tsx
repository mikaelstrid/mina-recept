import { notFound } from 'next/navigation'
import { categoryRepo } from '@/repositories/factory'
import { findRecipes } from '@/services/RecipeService'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params
  const [category, { items: recipes }] = await Promise.all([
    categoryRepo.findById(id),
    findRecipes({ categoryIds: [id] }, { page: 1, pageSize: 50 }),
  ])

  if (!category) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <div className="text-4xl">{category.svgIcon || '🍽️'}</div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground">{recipes.length} recept</p>
      </div>
      <RecipeGrid recipes={recipes} />
    </div>
  )
}
