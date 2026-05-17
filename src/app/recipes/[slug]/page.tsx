import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { findRecipeBySlug } from '@/services/RecipeService'
import { RecipeDetail } from '@/components/recipe/RecipeDetail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const recipe = await findRecipeBySlug(slug)
  if (!recipe) return {}
  return {
    title: `${recipe.title} — Mina recept`,
    description: recipe.description,
  }
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params
  const recipe = await findRecipeBySlug(slug)
  if (!recipe) notFound()

  return <RecipeDetail recipe={recipe} />
}
