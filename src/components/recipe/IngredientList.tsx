'use client'

import { useFieldArray, type Control } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import type { CreateRecipeFormData } from '@/lib/validations'

export function IngredientList({ control }: { control: Control<CreateRecipeFormData> }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' })

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input
            {...(control.register(`ingredients.${index}.ingredientName` as const))}
            placeholder="Ingrediens"
            className="h-9 flex-1 rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            {...(control.register(`ingredients.${index}.quantity` as const))}
            placeholder="Mängd (t.ex. 2 dl)"
            className="h-9 w-32 rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ ingredientName: '', quantity: '' })}
        className="flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <Plus className="h-4 w-4" />
        Lägg till ingrediens
      </button>
    </div>
  )
}
