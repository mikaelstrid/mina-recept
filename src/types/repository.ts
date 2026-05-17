export interface RecipeFilters {
  searchText?: string
  categoryIds?: string[]
  tagIds?: string[]
  ingredientIds?: string[]
  authorId?: string
  includeArchived?: boolean
}

export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
