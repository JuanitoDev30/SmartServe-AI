'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ProductType,
  ProductStatus,
} from '@/features/productos/schemas/productSchema';
import {
  productFormSchema,
  ProductFormValues,
} from '@/lib/validations/product';
import { CategoryType } from '@/features/categories/schemas/categorySchema';
import { cn } from '@/lib/utils';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void;
  product?: ProductType | null;
  isLoading?: boolean;
  error?: string | null;
  categories?: CategoryType[];
}

const statuses: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'low_stock', label: 'Stock bajo' },
  { value: 'out_of_stock', label: 'Sin stock' },
];

const defaultValues: ProductFormValues = {
  nombre: '',
  precio: 0,
  descripcion: '',
  slug: '',
  stock: 0,
  proveedor: '',
  status: 'active',
  categoriaId: '',
};

function getServerErrorField(
  error: string | null | undefined,
): 'nombre' | 'slug' | 'general' | null {
  if (!error) return null;
  if (error.includes('nombre')) return 'nombre';
  if (error.includes('slug')) return 'slug';
  return 'general';
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading,
  error,
  categories,
}: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      reset({
        nombre: product.nombre,
        precio: Number(product.precio) || 0,
        descripcion: product.descripcion ?? '',
        slug: product.slug ?? '',
        stock: product.stock ?? 0,
        proveedor: product.proveedor ?? '',
        status: product.status,
        categoriaId: product.categoria?.id ?? '',
      });
    } else {
      reset(defaultValues);
    }
  }, [product, isOpen, reset]);

  const serverErrorField = getServerErrorField(error);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="p-6 space-y-5">
            {/* Error general del servidor */}
            {serverErrorField === 'general' && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre del producto
              </label>
              <Input
                {...register('nombre')}
                placeholder="Ej: Aguardiente"
                className={cn(
                  'h-11',
                  (errors.nombre || serverErrorField === 'nombre') &&
                    'border-red-500 focus:ring-red-500',
                )}
              />
              {/* Error de validación local (Zod) */}
              {errors.nombre && (
                <p className="text-red-600 text-sm">{errors.nombre.message}</p>
              )}
              {/* Error de servidor relacionado al nombre */}
              {!errors.nombre && serverErrorField === 'nombre' && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Descripción
              </label>
              <textarea
                {...register('descripcion')}
                placeholder="Descripción del producto..."
                rows={3}
                className="flex w-full rounded-lg border border-input bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              {errors.descripcion && (
                <p className="text-red-600 text-sm">
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            {/* Slug & Categoría */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  SLUG
                </label>
                <Input
                  {...register('slug')}
                  placeholder="Ej: aguardiente-nariño"
                  className={cn(
                    'h-11 font-mono',
                    (errors.slug || serverErrorField === 'slug') &&
                      'border-red-500 focus:ring-red-500',
                  )}
                />
                {errors.slug && (
                  <p className="text-red-600 text-sm">{errors.slug.message}</p>
                )}
                {!errors.slug && serverErrorField === 'slug' && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                    {error}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Categoría
                </label>
                <select
                  {...register('categoriaId')}
                  className={cn(
                    'flex h-11 w-full rounded-lg border border-input bg-input px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    errors.categoriaId && 'border-red-500',
                  )}
                >
                  <option value="" disabled>
                    Selecciona la categoría
                  </option>
                  {categories?.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoriaId && (
                  <p className="text-red-600 text-sm">
                    {errors.categoriaId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Precio & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Precio de venta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    // valueAsNumber le dice a RHF que convierta el string del
                    // input a number antes de pasarlo al schema — sin esto
                    // Zod recibiría un string y fallaría la validación de number
                    {...register('precio', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    step="0.01"
                    className={cn(
                      'h-11 pl-7',
                      errors.precio && 'border-red-500',
                    )}
                  />
                </div>
                {errors.precio && (
                  <p className="text-red-600 text-sm">
                    {errors.precio.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Stock actual
                </label>
                <Input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className={cn('h-11', errors.stock && 'border-red-500')}
                />
                {errors.stock && (
                  <p className="text-red-600 text-sm">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Proveedor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Proveedor
              </label>
              <Input
                {...register('proveedor')}
                placeholder="Ej: Distribuidora XYZ"
                className="h-11"
              />
              {errors.proveedor && (
                <p className="text-red-600 text-sm">
                  {errors.proveedor.message}
                </p>
              )}
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Estado
              </label>
              <select
                {...register('status')}
                className="flex h-11 w-full rounded-lg border border-input bg-input px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {statuses.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
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
                : product
                  ? 'Actualizar'
                  : 'Crear producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
