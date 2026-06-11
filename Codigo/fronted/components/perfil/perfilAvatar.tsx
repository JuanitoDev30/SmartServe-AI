import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Perfil } from '@/features/perfil/schemas/perfilSchema';

export function PerfilAvatar({ perfil }: { perfil: Perfil | null }) {
  const iniciales =
    perfil?.nombre
      ?.split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'AD';

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            {iniciales}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-foreground">
            {perfil?.nombre}
          </p>
          <p className="text-sm text-muted-foreground">{perfil?.email}</p>
          <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-500 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Administrador activo
          </span>
        </div>
      </div>
    </div>
  );
}
