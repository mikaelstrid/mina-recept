import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import type { Recipe } from '@/types/entities'
import { formatCookingTime } from '@/lib/utils'

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const topIngredients = recipe.ingredients.slice(0, 3).map((ri) => ri.ingredient.name)

  return (
    <Link href={`/recipes/${recipe.urlSlug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
              🍽️
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h2 className="font-semibold text-base leading-tight line-clamp-2">{recipe.title}</h2>

          {recipe.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {topIngredients.length > 0 && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {topIngredients.join(', ')}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            {recipe.cookingTimeMinutes && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                {formatCookingTime(recipe.cookingTimeMinutes)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
