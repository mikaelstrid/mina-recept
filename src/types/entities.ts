export interface User {
  id: string
  emailAddress: string
  firstName: string
  lastName: string
  isAdmin: boolean
}

export interface Ingredient {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  svgIcon: string
}

export interface Tag {
  id: string
  name: string
}

export interface Step {
  order: number
  description: string
}

export interface RecipeIngredient {
  ingredient: Ingredient
  quantity: string // e.g. "2 dl", "3 msk", "en nypa"
}

export interface Recipe {
  id: string
  title: string
  urlSlug: string
  ingredients: RecipeIngredient[]
  steps: Step[]
  tags: Tag[]
  categories: Category[]
  cookingTimeMinutes?: number
  description?: string
  imageUrl?: string
  author: User
  archivedAt?: Date
  createdAt: Date
  updatedAt: Date
}
