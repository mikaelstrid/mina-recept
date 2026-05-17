import type { Recipe } from '@/types/entities'
import { RecipeCard } from './RecipeCard'

interface RecipeGridProps {
  recipes: Recipe[]
  emptyMessage?: string
}

export function RecipeGrid({ recipes, emptyMessage = 'Inga recept hittades.' }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl">🍽️</p>
        <p className="mt-3 text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
