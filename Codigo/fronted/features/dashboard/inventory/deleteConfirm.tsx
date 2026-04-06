'use client';

import { Product } from '@/types';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductType } from '@/features/users/schemas/productSchema';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: ProductType | null;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Eliminar producto
          </h3>

          {/* Message */}
          <p className="text-sm text-muted-foreground mb-6">
            Estas seguro de que deseas eliminar{' '}
            <span className="font-medium text-foreground">
              {product.nombre}
            </span>
            ? Esta accion no se puede deshacer.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
