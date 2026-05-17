import { notFound } from 'next/navigation'
import { tagRepo } from '@/repositories/factory'
import { findRecipes } from '@/services/RecipeService'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TagPage({ params }: Props) {
  const { id } = await params
  const [tag, { items: recipes }] = await Promise.all([
    tagRepo.findById(id),
    findRecipes({ tagIds: [id] }, { page: 1, pageSize: 50 }),
  ])

  if (!tag) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{tag.name}</h1>
        <p className="text-muted-foreground">{recipes.length} recept</p>
      </div>
      <RecipeGrid recipes={recipes} />
    </div>
  )
}
