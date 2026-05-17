import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'data', 'azure-table-storage')

async function writeJson(filename: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`✓ Wrote ${filename}`)
}

const categories = [
  { id: crypto.randomUUID(), name: 'Frukost', svgIcon: '🥣' },
  { id: crypto.randomUUID(), name: 'Lunch', svgIcon: '🥗' },
  { id: crypto.randomUUID(), name: 'Middag', svgIcon: '🍽️' },
  { id: crypto.randomUUID(), name: 'Dessert', svgIcon: '🍰' },
  { id: crypto.randomUUID(), name: 'Bakning', svgIcon: '🥐' },
  { id: crypto.randomUUID(), name: 'Snabbmat', svgIcon: '⚡' },
  { id: crypto.randomUUID(), name: 'Soppa', svgIcon: '🍲' },
  { id: crypto.randomUUID(), name: 'Sallad', svgIcon: '🥬' },
]

const now = new Date().toISOString()

const middagCategory = categories.find((c) => c.name === 'Middag')!
const snabbmatCategory = categories.find((c) => c.name === 'Snabbmat')!

const pasta = { id: crypto.randomUUID(), name: 'Pasta' }
const tomatSas = { id: crypto.randomUUID(), name: 'Tomatsås' }
const vitlok = { id: crypto.randomUUID(), name: 'Vitlök' }
const olivolja = { id: crypto.randomUUID(), name: 'Olivolja' }
const agg = { id: crypto.randomUUID(), name: 'Ägg' }
const ost = { id: crypto.randomUUID(), name: 'Parmesanost' }
const bacon = { id: crypto.randomUUID(), name: 'Bacon' }
const gradde = { id: crypto.randomUUID(), name: 'Grädde' }

const ingredients = [pasta, tomatSas, vitlok, olivolja, agg, ost, bacon, gradde]

const tagVegetariskt = { id: crypto.randomUUID(), name: 'Vegetariskt' }
const tagSnabblagat = { id: crypto.randomUUID(), name: 'Snabblagat' }
const tagItalienst = { id: crypto.randomUUID(), name: 'Italienskt' }

const tags = [tagVegetariskt, tagSnabblagat, tagItalienst]

const demoUser = {
  id: crypto.randomUUID(),
  emailAddress: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'Användare',
  isAdmin: true,
}

const recipes = [
  {
    id: crypto.randomUUID(),
    title: 'Pasta Carbonara',
    urlSlug: 'pasta-carbonara',
    description: 'En klassisk italiensk pastarätt med krämig ägg- och ostsås.',
    cookingTimeMinutes: 25,
    imageUrl: null,
    categories: [middagCategory, snabbmatCategory],
    tags: [tagSnabblagat, tagItalienst],
    ingredients: [
      { ingredient: pasta, quantity: '400 g' },
      { ingredient: agg, quantity: '4 st' },
      { ingredient: ost, quantity: '100 g' },
      { ingredient: bacon, quantity: '150 g' },
      { ingredient: olivolja, quantity: '2 msk' },
    ],
    steps: [
      { order: 1, description: 'Koka pastan enligt förpackningens anvisning.' },
      { order: 2, description: 'Stek baconet knaprigt i olivolja.' },
      { order: 3, description: 'Vispa ihop ägg och riven parmesan i en skål.' },
      { order: 4, description: 'Blanda den heta pastan med bacon och ta från värmen.' },
      { order: 5, description: 'Häll äggblandningen över pastan och rör snabbt. Servera genast.' },
    ],
    author: demoUser,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    title: 'Pasta med tomatsås',
    urlSlug: 'pasta-med-tomatsas',
    description: 'En enkel och god pasta med hemgjord tomatsås.',
    cookingTimeMinutes: 20,
    imageUrl: null,
    categories: [middagCategory],
    tags: [tagVegetariskt, tagSnabblagat, tagItalienst],
    ingredients: [
      { ingredient: pasta, quantity: '400 g' },
      { ingredient: tomatSas, quantity: '400 g' },
      { ingredient: vitlok, quantity: '2 klyftor' },
      { ingredient: olivolja, quantity: '3 msk' },
    ],
    steps: [
      { order: 1, description: 'Koka pastan.' },
      { order: 2, description: 'Fräs hackad vitlök i olivolja.' },
      { order: 3, description: 'Tillsätt tomatsåsen och låt sjuda 10 minuter.' },
      { order: 4, description: 'Servera såsen över pastan.' },
    ],
    author: demoUser,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  },
]

async function seed() {
  await writeJson('categories.json', categories)
  await writeJson('ingredients.json', ingredients)
  await writeJson('tags.json', tags)
  await writeJson('users.json', [demoUser])
  await writeJson('recipes.json', recipes)
  await writeJson('sessions.json', [])
  await writeJson('verificationTokens.json', [])

  console.log('\n✅ Seed complete!')
  console.log(`   ${categories.length} kategorier, ${recipes.length} recept, ${tags.length} taggar`)
}

seed().catch(console.error)
