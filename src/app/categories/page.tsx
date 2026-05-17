import Link from 'next/link'
import { categoryRepo, recipeRepo } from '@/repositories/factory'

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([
    categoryRepo.findAll(),
    recipeRepo.countsByCategory(),
  ])

  const sorted = [...categories].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Kategorier</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
          >
            <span className="text-4xl">{cat.svgIcon || '🍽️'}</span>
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{counts[cat.id] ?? 0} recept</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
