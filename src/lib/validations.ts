import { z } from 'zod'

export const recipeIngredientSchema = z.object({
  ingredientName: z.string().min(1, 'Ingrediensnamn krävs'),
  quantity: z.string().min(1, 'Mängd krävs'),
})

export const stepSchema = z.object({
  order: z.number().int().positive(),
  description: z.string().min(1, 'Stegbeskrivning krävs'),
})

export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Titel krävs').max(200, 'Titeln är för lång'),
  description: z.string().max(2000, 'Beskrivningen är för lång').optional(),
  cookingTimeMinutes: z.number().int().positive().max(1440).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  categoryIds: z.array(z.string()),
  tagNames: z.array(z.string().min(1).max(50)),
  ingredients: z.array(recipeIngredientSchema).min(1, 'Minst en ingrediens krävs'),
  steps: z.array(stepSchema).min(1, 'Minst ett steg krävs'),
})

export const updateRecipeSchema = createRecipeSchema.partial().extend({
  urlSlug: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
})

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, 'Förnamn krävs'),
  lastName: z.string().min(1, 'Efternamn krävs'),
})

export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>
export type UpdateRecipeFormData = z.infer<typeof updateRecipeSchema>
export type LoginFormData = z.infer<typeof loginSchema>
