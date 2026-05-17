'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { createRecipeSchema, type CreateRecipeFormData } from '@/lib/validations'
import { IngredientList } from './IngredientList'
import { StepList } from './StepList'
import type { Category, Tag, Recipe } from '@/types/entities'

interface RecipeFormProps {
  mode: 'create' | 'edit'
  recipe?: Recipe
  categories: Category[]
  tags: Tag[]
}

function recipeToFormData(recipe: Recipe): CreateRecipeFormData {
  return {
    title: recipe.title,
    description: recipe.description ?? '',
    cookingTimeMinutes: recipe.cookingTimeMinutes,
    imageUrl: recipe.imageUrl ?? '',
    categoryIds: recipe.categories.map((c) => c.id),
    tagNames: recipe.tags.map((t) => t.name),
    ingredients: recipe.ingredients.map((ri) => ({
      ingredientName: ri.ingredient.name,
      quantity: ri.quantity,
    })),
    steps: recipe.steps,
  }
}

export function RecipeForm({ mode, recipe, categories, tags }: RecipeFormProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues:
      mode === 'edit' && recipe
        ? recipeToFormData(recipe)
        : {
            title: '',
            description: '',
            categoryIds: [],
            tagNames: [],
            ingredients: [{ ingredientName: '', quantity: '' }],
            steps: [{ order: 1, description: '' }],
          },
  })

  const selectedCategoryIds = watch('categoryIds') ?? []
  const currentTags = watch('tagNames') ?? []
  const imageUrl = watch('imageUrl')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setValue('imageUrl', url)
    } catch {
      alert('Bilduppladdning misslyckades. Försök igen.')
    } finally {
      setUploading(false)
    }
  }

  function toggleCategory(id: string) {
    if (selectedCategoryIds.includes(id)) {
      setValue('categoryIds', selectedCategoryIds.filter((c) => c !== id))
    } else {
      setValue('categoryIds', [...selectedCategoryIds, id])
    }
  }

  function addTag(name: string) {
    const trimmed = name.trim()
    if (!trimmed || currentTags.includes(trimmed)) return
    setValue('tagNames', [...currentTags, trimmed])
    setTagInput('')
  }

  function removeTag(name: string) {
    setValue('tagNames', currentTags.filter((t) => t !== name))
  }

  async function onSubmit(data: CreateRecipeFormData) {
    const stepsWithOrder = data.steps.map((s, i) => ({ ...s, order: i + 1 }))
    const payload = { ...data, steps: stepsWithOrder }

    const url = mode === 'edit' && recipe ? `/api/recipes/${recipe.id}` : '/api/recipes'
    const method = mode === 'edit' ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      alert('Något gick fel. Försök igen.')
      return
    }

    const saved = await res.json()
    router.push(`/recipes/${saved.urlSlug}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Titel *</label>
        <input
          {...register('title')}
          placeholder="Receptets namn"
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Beskrivning</label>
        <textarea
          {...register('description')}
          placeholder="En kort beskrivning av receptet..."
          rows={3}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
      </div>

      {/* Cooking time */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Tillagingstid (minuter)</label>
        <input
          {...register('cookingTimeMinutes', { valueAsNumber: true })}
          type="number"
          min={1}
          placeholder="t.ex. 30"
          className="h-10 w-32 rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Bild</label>
        {imageUrl ? (
          <div className="relative w-full max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Förhandsgranskning" className="rounded-xl w-full aspect-video object-cover" />
            <button
              type="button"
              onClick={() => setValue('imageUrl', '')}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1 backdrop-blur transition-colors hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors hover:bg-muted">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {uploading ? 'Laddar upp...' : 'Klicka för att ladda upp en bild'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Kategorier</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  selectedCategoryIds.includes(cat.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Taggar</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {currentTags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full border bg-muted px-2.5 py-0.5 text-xs"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag(tagInput)
              }
            }}
            placeholder="Lägg till tagg..."
            className="h-9 flex-1 rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            className="rounded-lg border px-3 text-sm transition-colors hover:bg-muted"
          >
            Lägg till
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags
              .filter((t) => !currentTags.includes(t.name))
              .slice(0, 15)
              .map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => addTag(t.name)}
                  className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted"
                >
                  {t.name}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Ingredienser *</label>
        <IngredientList control={control} />
        {errors.ingredients && (
          <p className="text-xs text-destructive">{errors.ingredients.message as string}</p>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Steg *</label>
        <StepList control={control} />
        {errors.steps && (
          <p className="text-xs text-destructive">{errors.steps.message as string}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Sparar...' : mode === 'create' ? 'Spara recept' : 'Spara ändringar'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-6 py-2.5 text-sm transition-colors hover:bg-muted"
        >
          Avbryt
        </button>
      </div>
    </form>
  )
}
