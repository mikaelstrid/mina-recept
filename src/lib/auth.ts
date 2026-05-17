import NextAuth, { type DefaultSession } from 'next-auth'
import type { Adapter, AdapterUser, AdapterSession, AdapterAccount, VerificationToken } from 'next-auth/adapters'
import ResendProvider from 'next-auth/providers/resend'
import { userRepo, sessionRepo, verificationTokenRepo } from '@/repositories/factory'
import { generateId } from '@/lib/utils'
import type { User } from '@/types/entities'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      isAdmin: boolean
    } & DefaultSession['user']
  }
}

function toAdapterUser(user: User): AdapterUser {
  return {
    id: user.id,
    email: user.emailAddress,
    name: `${user.firstName} ${user.lastName}`.trim() || user.emailAddress,
    emailVerified: new Date(),
  }
}

function buildAdapter(): Adapter {
  return {
    async createUser(data) {
      const user: User = {
        id: generateId(),
        emailAddress: data.email,
        firstName: '',
        lastName: '',
        isAdmin: false,
      }
      await userRepo.create(user)
      return toAdapterUser(user)
    },
    async getUser(id) {
      const user = await userRepo.findById(id)
      return user ? toAdapterUser(user) : null
    },
    async getUserByEmail(email) {
      const user = await userRepo.findByEmail(email)
      return user ? toAdapterUser(user) : null
    },
    async getUserByAccount({ providerAccountId }) {
      const user = await userRepo.findByEmail(providerAccountId)
      return user ? toAdapterUser(user) : null
    },
    async updateUser(data) {
      const existing = await userRepo.findById(data.id!)
      if (!existing) throw new Error(`User ${data.id} not found`)
      const updated = { ...existing, emailAddress: data.email ?? existing.emailAddress }
      await userRepo.update(updated)
      return toAdapterUser(updated)
    },
    async deleteUser(id) {
      await userRepo.delete(id)
    },
    async linkAccount(_account: AdapterAccount) {},
    async unlinkAccount() {},
    async createSession(data) {
      const session = {
        id: generateId(),
        userId: data.userId,
        expires: data.expires,
        sessionToken: data.sessionToken,
      }
      await sessionRepo.create(session)
      return session
    },
    async getSessionAndUser(sessionToken) {
      const session = await sessionRepo.findByToken(sessionToken)
      if (!session || session.expires < new Date()) return null
      const user = await userRepo.findById(session.userId)
      if (!user) return null
      return {
        session: {
          userId: session.userId,
          expires: session.expires,
          sessionToken: session.sessionToken,
        },
        user: toAdapterUser(user),
      }
    },
    async updateSession(data) {
      const existing = await sessionRepo.findByToken(data.sessionToken)
      if (!existing) return null
      const updated = { ...existing, expires: data.expires ?? existing.expires }
      await sessionRepo.update(updated)
      return {
        userId: updated.userId,
        expires: updated.expires,
        sessionToken: updated.sessionToken,
      }
    },
    async deleteSession(sessionToken) {
      await sessionRepo.delete(sessionToken)
    },
    async createVerificationToken(data: VerificationToken) {
      await verificationTokenRepo.create({
        identifier: data.identifier,
        token: data.token,
        expires: data.expires,
      })
      return data
    },
    async useVerificationToken({ identifier, token }) {
      const vt = await verificationTokenRepo.findByIdentifierAndToken(identifier, token)
      if (!vt) return null
      await verificationTokenRepo.delete(identifier, token)
      return { identifier: vt.identifier, token: vt.token, expires: vt.expires }
    },
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: buildAdapter(),
  session: { strategy: 'database' },
  providers: [
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_ADDRESS ?? 'noreply@example.com',
      sendVerificationRequest: async ({ identifier, url }) => {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.RESEND_FROM_ADDRESS ?? 'noreply@example.com',
          to: identifier,
          subject: 'Logga in på Mina recept',
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color:#171717;">Logga in på Mina recept</h2>
              <p style="color:#737373;">Klicka på länken nedan för att logga in. Länken är giltig i 24 timmar.</p>
              <a href="${url}" style="display:inline-block;padding:12px 24px;background:#e05a4f;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin:8px 0;">
                Logga in
              </a>
              <p style="color:#a3a3a3;font-size:0.8rem;margin-top:24px;">
                Om du inte begärde denna länk kan du ignorera detta mejl.
              </p>
            </div>
          `,
        })
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const appUser = await userRepo.findById(user.id)
      if (appUser) {
        session.user.id = appUser.id
        session.user.firstName = appUser.firstName
        session.user.lastName = appUser.lastName
        session.user.isAdmin = appUser.isAdmin
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify',
  },
})
