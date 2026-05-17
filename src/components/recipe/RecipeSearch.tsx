'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { Category, Tag } from '@/types/entities'

interface RecipeSearchProps {
  categories: Category[]
  tags: Tag[]
  initialQ?: string
  initialCategoryIds?: string[]
  initialTagIds?: string[]
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function RecipeSearch({
  categories,
  tags,
  initialQ = '',
  initialCategoryIds = [],
  initialTagIds = [],
}: RecipeSearchProps) {
  const router = useRouter()

  const [q, setQ] = useState(initialQ)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategoryIds)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTagIds)

  const debouncedQ = useDebounce(q, 300)

  const updateUrl = useCallback(
    (search: string, cats: string[], tgs: string[]) => {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      if (cats.length) params.set('categories', cats.join(','))
      if (tgs.length) params.set('tags', tgs.join(','))
      router.push(`/recipes?${params.toString()}`)
    },
    [router]
  )

  useEffect(() => {
    updateUrl(debouncedQ, selectedCategories, selectedTags)
  }, [debouncedQ, selectedCategories, selectedTags, updateUrl])

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function toggleTag(id: string) {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const hasFilters = q || selectedCategories.length > 0 || selectedTags.length > 0

  function clearAll() {
    setQ('')
    setSelectedCategories([])
    setSelectedTags([])
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Sök recept, ingredienser, taggar..."
          className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                selectedCategories.includes(cat.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'border bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 20).map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-primary/10 text-primary border-primary border'
                  : 'border bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Rensa filter
        </button>
      )}
    </div>
  )
}
