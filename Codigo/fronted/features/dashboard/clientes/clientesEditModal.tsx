'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, User, Phone, Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  type Cliente,
  updateClienteSchema,
  type UpdateClienteInput,
} from '@/features/clientes/schemas/clientSchema';

interface ClienteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateClienteInput) => void;
  cliente: Cliente | null;
  isLoading: boolean;
}
export function ClienteEditModal({
  isOpen,
  onClose,
  onSubmit,
  cliente,
  isLoading,
}: ClienteEditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateClienteInput>({
    resolver: zodResolver(updateClienteSchema),
    defaultValues: {
      nombre: '',
      telefono: '',
      email: '',
      direccionPrincipal: '',
    },
  });

  useEffect(() => {
    if (cliente) {
      reset({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email ?? '',
        direccionPrincipal: cliente.direccionPrincipal ?? '',
      });
    }
  }, [cliente, reset]);

  if (!isOpen || !cliente) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl mx-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Editar Cliente
            </h2>
            {cliente && (
              <p className="text-sm text-muted-foreground mt-0.5">
                ID: {cliente.id.slice(0, 8)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Nombre */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <User className="size-4" />
              <h3 className="font-medium">Información Personal</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre completo
              </label>
              <Input
                {...register('nombre')}
                placeholder="Nombre del cliente"
                className={cn(
                  errors.nombre &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email <span className="text-muted-foreground">(opcional)</span>
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="cliente@ejemplo.com"
                className={cn(
                  errors.email &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground mb-2">
              <Phone className="size-4" />
              <h3 className="font-medium">Teléfono</h3>
            </div>
            <Input
              type="tel"
              placeholder="3001234567"
              {...register('telefono', {
                onChange: e => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                },
              })}
              maxLength={10}
              className={cn(
                errors.telefono &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
            {!errors.telefono && (
              <p className="text-xs text-muted-foreground">
                Ingresa 10 dígitos sin espacios ni caracteres especiales.
              </p>
            )}
            {errors.telefono && (
              <p className="text-sm text-destructive">
                {errors.telefono.message}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground mb-2">
              <MapPin className="size-4" />
              <h3 className="font-medium">
                Dirección Principal{' '}
                <span className="text-muted-foreground text-sm font-normal">
                  (opcional)
                </span>
              </h3>
            </div>
            <Input
              {...register('direccionPrincipal')}
              placeholder="Calle, número, ciudad..."
              className={cn(
                errors.direccionPrincipal &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
            {errors.direccionPrincipal && (
              <p className="text-sm text-destructive">
                {errors.direccionPrincipal.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {isLoading ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
