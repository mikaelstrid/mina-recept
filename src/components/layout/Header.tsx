'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ChefHat, LogIn, LogOut, PlusCircle } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/recipes" className="flex items-center gap-2 font-semibold text-lg">
          <ChefHat className="h-6 w-6 text-primary" />
          Mina recept
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/recipes" className="text-muted-foreground transition-colors hover:text-foreground">
            Recept
          </Link>
          <Link href="/categories" className="text-muted-foreground transition-colors hover:text-foreground">
            Kategorier
          </Link>
          <Link href="/tags" className="text-muted-foreground transition-colors hover:text-foreground">
            Taggar
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/recipes/new"
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <PlusCircle className="h-4 w-4" />
                Nytt recept
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                title={`Logga ut (${session.user.email})`}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logga ut</span>
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogIn className="h-4 w-4" />
              Logga in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
