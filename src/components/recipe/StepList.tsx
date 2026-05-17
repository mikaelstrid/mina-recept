'use client'

import { useFieldArray, type Control, useWatch } from 'react-hook-form'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import type { CreateRecipeFormData } from '@/lib/validations'

export function StepList({ control }: { control: Control<CreateRecipeFormData> }) {
  const { fields, append, remove, swap } = useFieldArray({ control, name: 'steps' })

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground mt-0.5">
            {index + 1}
          </span>
          <textarea
            {...(control.register(`steps.${index}.description` as const))}
            placeholder={`Steg ${index + 1}...`}
            rows={2}
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => index > 0 && swap(index, index - 1)}
              disabled={index === 0}
              className="flex h-4 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => remove(index)}
              className="flex h-5 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => index < fields.length - 1 && swap(index, index + 1)}
              disabled={index === fields.length - 1}
              className="flex h-4 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ order: fields.length + 1, description: '' })}
        className="flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <Plus className="h-4 w-4" />
        Lägg till steg
      </button>
    </div>
  )
}
