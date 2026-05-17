import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { findRecipeById, updateRecipe, archiveRecipe } from '@/services/RecipeService'
import { updateRecipeSchema } from '@/lib/validations'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const recipe = await findRecipeById(id)
  if (!recipe) {
    return NextResponse.json({ error: 'Recept hittades inte', code: 'NOT_FOUND' }, { status: 404 })
  }
  return NextResponse.json(recipe)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Ej inloggad', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await params
  const recipe = await findRecipeById(id)
  if (!recipe) {
    return NextResponse.json({ error: 'Recept hittades inte', code: 'NOT_FOUND' }, { status: 404 })
  }

  const isAuthor = recipe.author.id === session.user.id
  const isAdmin = session.user.isAdmin
  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: 'Åtkomst nekad', code: 'FORBIDDEN' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = updateRecipeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ogiltiga data', code: 'VALIDATION_ERROR', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const updated = await updateRecipe(id, parsed.data)
  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Ej inloggad', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await params
  const recipe = await findRecipeById(id)
  if (!recipe) {
    return NextResponse.json({ error: 'Recept hittades inte', code: 'NOT_FOUND' }, { status: 404 })
  }

  const isAuthor = recipe.author.id === session.user.id
  const isAdmin = session.user.isAdmin
  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: 'Åtkomst nekad', code: 'FORBIDDEN' }, { status: 403 })
  }

  await archiveRecipe(id)
  return NextResponse.json({ success: true })
}
