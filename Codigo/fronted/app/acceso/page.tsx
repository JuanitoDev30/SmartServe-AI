interface AccesoPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AccesoPage({ searchParams }: AccesoPageProps) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <form
        method="post"
        action="/api/acceso"
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Demo del asistente</h1>
          <p className="text-sm text-muted-foreground">
            Escribe la clave que te compartieron para probar el agente.
          </p>
        </div>
        <input
          type="password"
          name="clave"
          autoFocus
          required
          placeholder="Clave de acceso"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-destructive">Esa clave no es correcta.</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
