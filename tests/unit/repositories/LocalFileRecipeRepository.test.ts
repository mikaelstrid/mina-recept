import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { LocalFileRecipeRepository } from '../../../src/repositories/local/LocalFileRecipeRepository'

describe('LocalFileRecipeRepository', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mina-recept-test-'))
    await fs.mkdir(path.join(tmpDir, 'data', 'azure-table-storage'), { recursive: true })
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  const makeUser = () => ({
    id: 'user-1',
    emailAddress: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isAdmin: false,
  })

  const makeRecipe = (overrides: Record<string, unknown> = {}) => ({
    id: 'recipe-1',
    title: 'Pasta Carbonara',
    urlSlug: 'pasta-carbonara',
    ingredients: [{ ingredient: { id: 'ing-1', name: 'Pasta' }, quantity: '400 g' }],
    steps: [{ order: 1, description: 'Koka pastan.' }],
    tags: [{ id: 'tag-1', name: 'Snabblagat' }],
    categories: [{ id: 'cat-1', name: 'Middag', svgIcon: '🍽️' }],
    author: makeUser(),
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  })

  it('creates and finds a recipe by slug', async () => {
    const repo = new LocalFileRecipeRepository()
    await repo.create(makeRecipe() as never)
    const found = await repo.findBySlug('pasta-carbonara')
    expect(found).not.toBeNull()
    expect(found?.title).toBe('Pasta Carbonara')
  })

  it('returns null for unknown slug', async () => {
    const repo = new LocalFileRecipeRepository()
    expect(await repo.findBySlug('nonexistent')).toBeNull()
  })

  it('filters by tag', async () => {
    const repo = new LocalFileRecipeRepository()
    await repo.create(makeRecipe() as never)
    await repo.create(makeRecipe({ id: 'recipe-2', urlSlug: 'other', tags: [] }) as never)

    const { items } = await repo.findMany({ tagIds: ['tag-1'] }, { page: 1, pageSize: 10 })
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('recipe-1')
  })

  it('excludes archived recipes by default', async () => {
    const repo = new LocalFileRecipeRepository()
    await repo.create(makeRecipe() as never)
    await repo.archive('recipe-1')

    const { items } = await repo.findMany({}, { page: 1, pageSize: 10 })
    expect(items).toHaveLength(0)
  })

  it('includes archived recipes when requested', async () => {
    const repo = new LocalFileRecipeRepository()
    await repo.create(makeRecipe() as never)
    await repo.archive('recipe-1')

    const { items } = await repo.findMany({ includeArchived: true }, { page: 1, pageSize: 10 })
    expect(items).toHaveLength(1)
    expect(items[0].archivedAt).toBeInstanceOf(Date)
  })

  it('searches by title', async () => {
    const repo = new LocalFileRecipeRepository()
    await repo.create(makeRecipe() as never)
    await repo.create(
      makeRecipe({ id: 'recipe-2', title: 'Tomatsoppa', urlSlug: 'tomatsoppa' }) as never
    )

    const { items } = await repo.findMany({ searchText: 'carbonara' }, { page: 1, pageSize: 10 })
    expect(items).toHaveLength(1)
    expect(items[0].title).toBe('Pasta Carbonara')
  })

  it('preserves Date objects through serialization', async () => {
    const repo = new LocalFileRecipeRepository()
    const date = new Date('2025-06-15T12:00:00Z')
    await repo.create(makeRecipe({ createdAt: date }) as never)

    const found = await repo.findBySlug('pasta-carbonara')
    expect(found?.createdAt).toBeInstanceOf(Date)
    expect(found?.createdAt.toISOString()).toBe(date.toISOString())
  })
})
