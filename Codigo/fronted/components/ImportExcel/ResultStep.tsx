'use client';

import { ImportProductsResponse } from '@/features/productos/types/importProduct';

interface Props {
  result: ImportProductsResponse;
  onClose: () => void;
  onReset: () => void;
}

export default function ResultStep({ result, onClose, onReset }: Props) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Resultado</h2>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded">
          <p className="text-3xl font-bold">{result.success}</p>

          <p>Importados</p>
        </div>

        <div className="bg-red-50 p-4 rounded">
          <p className="text-3xl font-bold">{result.errors.length}</p>

          <p>Errores</p>
        </div>
      </div>

      {result.errors.length > 0 && (
        <div className="mt-6 space-y-3">
          {result.errors.map(
            (
              error,

              i,
            ) => (
              <div key={i} className="border rounded p-3">
                <strong>Fila {error.fila}</strong>

                <ul>
                  {error.errores.map(
                    (
                      e,

                      j,
                    ) => (
                      <li key={j}>• {e}</li>
                    ),
                  )}
                </ul>
              </div>
            ),
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-8">
        <button onClick={onReset}>Importar otro</button>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
