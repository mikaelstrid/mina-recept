import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { userRepo } from '@/repositories/factory'
import { createRecipe, findRecipes } from '@/services/RecipeService'
import { createRecipeSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) ?? []
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  const result = await findRecipes(
    { searchText: q, categoryIds: categories, tagIds: tags },
    { page, pageSize: 12 }
  )
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Ej inloggad', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createRecipeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ogiltiga data', code: 'VALIDATION_ERROR', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const author = await userRepo.findById(session.user.id)
  if (!author) {
    return NextResponse.json({ error: 'Användare hittades inte', code: 'NOT_FOUND' }, { status: 404 })
  }

  const recipe = await createRecipe(parsed.data, author)
  return NextResponse.json(recipe, { status: 201 })
}
