import { tagRepo, recipeRepo } from '@/repositories/factory'
import { TagBadge } from '@/components/tag/TagBadge'

export default async function TagsPage() {
  const [tags, counts] = await Promise.all([tagRepo.findAll(), recipeRepo.countsByTag()])

  const sorted = [...tags].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Taggar</h1>
      <div className="flex flex-wrap gap-2">
        {sorted.map((tag) => (
          <TagBadge key={tag.id} tag={tag} count={counts[tag.id] ?? 0} />
        ))}
      </div>
    </div>
  )
}
