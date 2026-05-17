import { getRequiredSession } from '@/lib/auth-helpers'
import { categoryRepo, tagRepo } from '@/repositories/factory'
import { RecipeForm } from '@/components/recipe/RecipeForm'

export default async function NewRecipePage() {
  await getRequiredSession()
  const [categories, tags] = await Promise.all([categoryRepo.findAll(), tagRepo.findAll()])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Nytt recept</h1>
      <RecipeForm mode="create" categories={categories} tags={tags} />
    </div>
  )
}
