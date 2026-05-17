import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mina recept',
  description: 'Mitt personliga receptbibliotek',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            Mina recept
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
