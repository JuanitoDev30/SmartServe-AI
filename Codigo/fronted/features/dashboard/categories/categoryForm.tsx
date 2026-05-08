'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CategoryType,
  CategoryFormData,
  categorySchema,
} from '@/features/categories/schemas/categorySchema';
import { cn } from '@/lib/utils';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  category?: CategoryType | null;
  isLoading?: boolean;
  error?: string | null;
}
const defaultValues: CategoryFormData = {
  nombre: '',
  descripcion: '',
};
export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading,
  error,
}: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  useEffect(() => {
    if (category) {
      reset({
        nombre: category.nombre,
        descripcion: category.descripcion || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [category, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg mx-4 bg-card rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {category ? 'Editar categoría' : 'Nueva categoría'}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre de la categoría *
              </label>

              <Input
                placeholder="Ej: Bebidas, Snacks, Licores..."
                className={cn(
                  'h-11',
                  errors.nombre && 'border-red-500 focus-visible:ring-red-500',
                )}
                {...register('nombre')}
              />

              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Descripción
              </label>

              <textarea
                rows={3}
                placeholder="Descripción de la categoría (opcional)..."
                className={cn(
                  'flex w-full rounded-lg border border-input bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none',
                  errors.descripcion &&
                    'border-red-500 focus-visible:ring-red-500',
                )}
                {...register('descripcion')}
              />

              {errors.descripcion && (
                <p className="text-sm text-red-500">
                  {errors.descripcion.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Guardando...'
                : category
                  ? 'Actualizar'
                  : 'Crear categoría'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
