'use client';

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImportProductsResponse } from '@/features/productos/types/importProduct';

interface Props {
  result: ImportProductsResponse;
  onClose: () => void;
  onReset: () => void;
}

export default function ResultStep({ result, onClose, onReset }: Props) {
  const hasErrors = result.errors.length > 0;
  const allFailed = result.success === 0 && hasErrors;
  const partialSuccess = result.success > 0 && hasErrors;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Resultado de importación
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {allFailed
              ? 'No se pudo importar ningún producto'
              : partialSuccess
                ? 'Importación completada con algunos errores'
                : 'Importación completada exitosamente'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <p className="text-xs font-medium text-muted-foreground">
              Importados
            </p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            {result.success}
          </p>
        </div>

        <div
          className={cn(
            'rounded-xl border p-4 space-y-1',
            hasErrors
              ? 'border-red-500/20 bg-red-500/5'
              : 'border-border bg-muted/30',
          )}
        >
          <div className="flex items-center gap-2">
            <XCircle
              className={cn(
                'size-4',
                hasErrors ? 'text-red-500' : 'text-muted-foreground',
              )}
            />
            <p className="text-xs font-medium text-muted-foreground">Errores</p>
          </div>
          <p
            className={cn(
              'text-3xl font-bold',
              hasErrors ? 'text-red-600' : 'text-muted-foreground',
            )}
          >
            {result.errors.length}
          </p>
        </div>
      </div>

      {/* Errores */}
      {hasErrors && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="size-4 text-orange-500" />
            <p className="text-sm font-medium text-foreground">
              Detalle de errores
            </p>
          </div>
          {result.errors.map((error, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-muted/30 p-3 space-y-1"
            >
              <p className="text-xs font-semibold text-foreground">
                Fila {error.fila}
              </p>
              <ul className="space-y-0.5">
                {error.errores.map((e, j) => (
                  <li key={j} className="text-xs text-muted-foreground">
                    • {e}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="size-4" />
          Importar otro
        </button>
        <button
          onClick={onClose}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
            'hover:bg-primary/90 transition-colors',
          )}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
