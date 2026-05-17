export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="flex justify-center text-5xl">✉️</div>
        <h1 className="text-2xl font-bold">Kolla din e-post!</h1>
        <p className="text-muted-foreground">
          Vi har skickat en inloggningslänk till din e-postadress. Klicka på länken för att logga
          in. Länken är giltig i 24 timmar.
        </p>
        <p className="text-sm text-muted-foreground">
          Inget mejl? Kolla din skräppost eller{' '}
          <a href="/auth/login" className="underline underline-offset-4">
            försök igen
          </a>
          .
        </p>
      </div>
    </main>
  )
}
