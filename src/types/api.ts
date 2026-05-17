export interface CreateRecipeIngredientRequest {
  ingredientName: string
  quantity: string
}

export interface CreateStepRequest {
  order: number
  description: string
}

export interface CreateRecipeRequest {
  title: string
  description?: string
  cookingTimeMinutes?: number
  imageUrl?: string
  categoryIds: string[]
  tagNames: string[]
  ingredients: CreateRecipeIngredientRequest[]
  steps: CreateStepRequest[]
}

export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {
  urlSlug?: string
}

// Returned from AI parsing — all fields are optional
export interface ParsedRecipeResult {
  title?: string
  description?: string
  cookingTimeMinutes?: number
  ingredients?: CreateRecipeIngredientRequest[]
  steps?: CreateStepRequest[]
  suggestedTagNames?: string[]
  suggestedCategoryIds?: string[]
}

export interface ApiError {
  error: string
  code: string
}

export interface UploadImageResponse {
  url: string
}
