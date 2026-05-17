'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, User, Pencil, Archive } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { Recipe } from '@/types/entities'
import { formatCookingTime, formatSwedishDate } from '@/lib/utils'

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const { data: session } = useSession()
  const router = useRouter()
  const isAuthor = session?.user?.id === recipe.author.id
  const isAdmin = session?.user?.isAdmin

  async function handleArchive() {
    if (!confirm('Vill du arkivera detta recept?')) return
    await fetch(`/api/recipes/${recipe.id}`, { method: 'DELETE' })
    router.push('/recipes')
  }

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      {/* Hero image */}
      {recipe.imageUrl && (
        <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl leading-tight font-bold">{recipe.title}</h1>
          {(isAuthor || isAdmin) && (
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/recipes/${recipe.urlSlug}/edit`}
                className="hover:bg-muted flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Redigera
              </Link>
              <button
                onClick={handleArchive}
                className="text-destructive hover:bg-destructive/10 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors"
              >
                <Archive className="h-3.5 w-3.5" />
                Arkivera
              </button>
            </div>
          )}
        </div>

        {recipe.description && (
          <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {recipe.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-full px-3 py-1 text-sm font-medium transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          {recipe.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.id}`}
              className="text-muted-foreground hover:bg-muted inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
          {recipe.cookingTimeMinutes && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatCookingTime(recipe.cookingTimeMinutes)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {recipe.author.firstName || recipe.author.emailAddress}
          </span>
          <span>Skapad {formatSwedishDate(recipe.createdAt)}</span>
        </div>
      </div>

      {/* Ingredients */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Ingredienser</h2>
        <ul className="divide-y rounded-xl border">
          {recipe.ingredients.map((ri, i) => (
            <li key={i} className="flex items-baseline justify-between px-4 py-2.5 text-sm">
              <span>{ri.ingredient.name}</span>
              <span className="text-muted-foreground ml-4 text-right">{ri.quantity}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Gör så här</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step) => (
            <li key={step.order} className="flex gap-4">
              <span className="bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {step.order}
              </span>
              <p className="pt-0.5 leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
