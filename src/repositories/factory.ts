import 'server-only'
import type { IRecipeRepository } from './interfaces/IRecipeRepository'
import type { IUserRepository } from './interfaces/IUserRepository'
import type { ICategoryRepository } from './interfaces/ICategoryRepository'
import type { ITagRepository } from './interfaces/ITagRepository'
import type { IIngredientRepository } from './interfaces/IIngredientRepository'
import type { IBlobStorageService } from './interfaces/IBlobStorageService'
import type { ISessionRepository, IVerificationTokenRepository } from './interfaces/IAuthRepository'
import { LocalFileRecipeRepository } from './local/LocalFileRecipeRepository'
import { LocalFileUserRepository } from './local/LocalFileUserRepository'
import { LocalFileCategoryRepository } from './local/LocalFileCategoryRepository'
import { LocalFileTagRepository } from './local/LocalFileTagRepository'
import { LocalFileIngredientRepository } from './local/LocalFileIngredientRepository'
import { LocalFileBlobStorageService } from './local/LocalFileBlobStorageService'
import { LocalFileSessionRepository } from './local/LocalFileSessionRepository'
import { LocalFileVerificationTokenRepository } from './local/LocalFileVerificationTokenRepository'

const provider = process.env.STORAGE_PROVIDER ?? 'local'

function createRepositories() {
  if (provider === 'local') {
    return {
      recipeRepo: new LocalFileRecipeRepository() as IRecipeRepository,
      userRepo: new LocalFileUserRepository() as IUserRepository,
      categoryRepo: new LocalFileCategoryRepository() as ICategoryRepository,
      tagRepo: new LocalFileTagRepository() as ITagRepository,
      ingredientRepo: new LocalFileIngredientRepository() as IIngredientRepository,
      blobStorage: new LocalFileBlobStorageService() as IBlobStorageService,
      sessionRepo: new LocalFileSessionRepository() as ISessionRepository,
      verificationTokenRepo: new LocalFileVerificationTokenRepository() as IVerificationTokenRepository,
    }
  }

  if (provider === 'azure') {
    throw new Error(
      'Azure storage provider is not yet implemented. Install @azure/data-tables and @azure/storage-blob first (Phase 3).'
    )
  }

  throw new Error(`Unknown STORAGE_PROVIDER: "${provider}". Must be "local" or "azure".`)
}

// Singleton instances — created once per server process
const repositories = createRepositories()

export const {
  recipeRepo,
  userRepo,
  categoryRepo,
  tagRepo,
  ingredientRepo,
  blobStorage,
  sessionRepo,
  verificationTokenRepo,
} = repositories
