export interface AuthSession {
  id: string
  userId: string
  expires: Date
  sessionToken: string
}

export interface VerificationToken {
  identifier: string
  token: string
  expires: Date
}

export interface ISessionRepository {
  findByToken(sessionToken: string): Promise<AuthSession | null>
  create(session: AuthSession): Promise<void>
  update(session: AuthSession): Promise<void>
  delete(sessionToken: string): Promise<void>
  deleteByUserId(userId: string): Promise<void>
}

export interface IVerificationTokenRepository {
  findByIdentifierAndToken(identifier: string, token: string): Promise<VerificationToken | null>
  create(token: VerificationToken): Promise<void>
  delete(identifier: string, token: string): Promise<void>
}
