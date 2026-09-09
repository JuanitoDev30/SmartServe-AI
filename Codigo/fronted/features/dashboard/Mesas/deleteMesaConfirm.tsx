'use client';

import { AlertTriangle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Mesa } from '@/features/mesas/schemas/mesaSchema';

interface DeleteMesaConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mesa: Mesa | null;
  isLoading?: boolean;
}

export function DeleteMesaConfirm({
  isOpen,
  onClose,
  onConfirm,
  mesa,
  isLoading,
}: DeleteMesaConfirmProps) {
  if (!isOpen || !mesa) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            Eliminar mesa
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <p className="text-sm text-foreground">
              ¿Eliminar la{' '}
              <span className="font-semibold">mesa {mesa.numero}</span> del
              salón?
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Si la mesa ya tiene reservas asociadas no se podrá eliminar: en ese
            caso ponla fuera de servicio para conservar el historial.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Volver
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
