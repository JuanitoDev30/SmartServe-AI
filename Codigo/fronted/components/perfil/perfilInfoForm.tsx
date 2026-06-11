import { Perfil } from '@/features/perfil/schemas/perfilSchema';
import { usePerfilForm } from '@/hooks/usePerfilForm';
import { Mail, Phone, Save, User } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export function PerfilInfoForm({
  initialData,
}: {
  initialData: Perfil | null;
}) {
  const { form, isSubmitting, onSubmit } = usePerfilForm(initialData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-2">
        <User className="size-4 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">Información Personal</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nombre completo
          </label>
          <Input
            {...register('nombre')}
            placeholder="Tu nombre"
            className={cn(
              errors.nombre &&
                'border-destructive focus-visible:ring-destructive',
            )}
          />
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              {...register('email')}
              type="email"
              placeholder="tu@email.com"
              className={cn(
                'pl-9',
                errors.email &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Teléfono <span className="text-muted-foreground">(opcional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              {...register('telefono')}
              type="tel"
              placeholder="3001234567"
              className={cn(
                'pl-9',
                errors.telefono &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
          </div>
          {errors.telefono && (
            <p className="text-sm text-destructive">
              {errors.telefono.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
              'hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSubmitting ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
