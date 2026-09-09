'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hash, Loader2, MapPin, Save, Users, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  mesaFormSchema,
  zonaMesaOptions,
  type MesaFormValues,
} from '@/lib/validations/mesa';
import type { Mesa } from '@/features/mesas/schemas/mesaSchema';

interface MesaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: MesaFormValues) => void;
  mesa: Mesa | null;
  isLoading: boolean;
  error?: string | null;
}

const VALORES_INICIALES: MesaFormValues = {
  numero: 1,
  capacidad: 4,
  zona: 'INTERIOR',
  activa: true,
  descripcion: '',
};

export function MesaFormModal({
  isOpen,
  onClose,
  onSubmit,
  mesa,
  isLoading,
  error,
}: MesaFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<MesaFormValues>({
    resolver: zodResolver(mesaFormSchema),
    defaultValues: VALORES_INICIALES,
  });

  const zona = useWatch({ control, name: 'zona' });
  const activa = useWatch({ control, name: 'activa' });

  useEffect(() => {
    if (!isOpen) return;

    reset(
      mesa
        ? {
            numero: mesa.numero,
            capacidad: mesa.capacidad,
            zona: mesa.zona,
            activa: mesa.activa,
            descripcion: mesa.descripcion ?? '',
          }
        : VALORES_INICIALES,
    );
  }, [isOpen, mesa, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {mesa ? `Editar mesa ${mesa.numero}` : 'Nueva mesa'}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Define capacidad y zona del salón
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Hash className="size-4" />
                Número
              </label>
              <Input
                type="number"
                min={1}
                {...register('numero', { valueAsNumber: true })}
                className={cn(
                  errors.numero &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              {errors.numero && (
                <p className="text-sm text-destructive">
                  {errors.numero.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="size-4" />
                Capacidad
              </label>
              <Input
                type="number"
                min={1}
                max={50}
                {...register('capacidad', { valueAsNumber: true })}
                className={cn(
                  errors.capacidad &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              {errors.capacidad && (
                <p className="text-sm text-destructive">
                  {errors.capacidad.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="size-4" />
              Zona
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {zonaMesaOptions.map(opcion => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => setValue('zona', opcion.value)}
                  className={cn(
                    'rounded-lg border px-2 py-2 text-sm font-medium transition-colors',
                    zona === opcion.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40',
                  )}
                >
                  {opcion.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Descripción (opcional)
            </label>
            <Input
              {...register('descripcion')}
              placeholder="Junto a la ventana, mesa alta..."
            />
            {errors.descripcion && (
              <p className="text-sm text-destructive">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setValue('activa', !activa)}
            className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/40"
          >
            <span>
              <span className="block text-sm font-medium text-foreground">
                Mesa disponible
              </span>
              <span className="block text-xs text-muted-foreground">
                Las mesas fuera de servicio no se pueden reservar
              </span>
            </span>

            <span
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                activa ? 'bg-primary' : 'bg-muted-foreground/30',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 size-5 rounded-full bg-white transition-transform',
                  activa ? 'translate-x-[1.375rem]' : 'translate-x-0.5',
                )}
              />
            </span>
          </button>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {mesa ? 'Guardar cambios' : 'Crear mesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
