import { notFound, redirect } from 'next/navigation'
import { getRequiredSession } from '@/lib/auth-helpers'
import { findRecipeBySlug } from '@/services/RecipeService'
import { categoryRepo, tagRepo } from '@/repositories/factory'
import { RecipeForm } from '@/components/recipe/RecipeForm'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditRecipePage({ params }: Props) {
  const [session, { slug }] = await Promise.all([getRequiredSession(), params])
  const recipe = await findRecipeBySlug(slug)
  if (!recipe) notFound()

  const isAuthor = recipe.author.id === session.user.id
  if (!isAuthor && !session.user.isAdmin) redirect(`/recipes/${slug}`)

  const [categories, tags] = await Promise.all([categoryRepo.findAll(), tagRepo.findAll()])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Redigera recept</h1>
      <RecipeForm mode="edit" recipe={recipe} categories={categories} tags={tags} />
    </div>
  )
}
