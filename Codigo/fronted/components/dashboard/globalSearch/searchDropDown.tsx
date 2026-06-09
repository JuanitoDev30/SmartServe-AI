import { Package, ShoppingBag, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';

import type { SearchRepositoryInterface } from '@/features/search/services/repositories/searchRepositoryInterface';
import { estadoClienteColors } from '@/features/clientes/utils/clientesConstants';
import { estadoPedidoColors } from '@/features/pedidos/utils/transiciones';

interface SearchDropdownProps {
  query: string;
  results: SearchRepositoryInterface | null;
  totalResults: number;
  onNavigate: (path: string) => void;
}

export function SearchDropdown({
  query,
  results,
  totalResults,
  onNavigate,
}: SearchDropdownProps) {
  if (!results) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-[420px] rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
      {totalResults === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No se encontraron resultados para &quot;{query}&quot;
        </div>
      ) : (
        <div className="max-h-[480px] overflow-y-auto">
          {/* Clientes */}
          {results.clientes.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <User className="size-3" /> Clientes
                </p>
              </div>
              {results.clientes.map(c => (
                <button
                  key={c.id}
                  onClick={() => onNavigate('/dashboard/clientes')}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                      {c.nombre
                        .split(' ')
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {c.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.telefono}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      estadoClienteColors[c.estado] ??
                        'bg-muted text-muted-foreground',
                    )}
                  >
                    {c.estado}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Pedidos */}
          {results.pedidos.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="size-3" /> Pedidos
                </p>
              </div>
              {results.pedidos.map(p => (
                <button
                  key={p.id}
                  onClick={() => onNavigate('/dashboard/pedido')}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      #{p.id.slice(0, 8)} — {p.cliente}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.creadoEn).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        estadoPedidoColors[p.estado] ??
                          'bg-muted text-muted-foreground',
                      )}
                    >
                      {p.estado}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(Number(p.total))}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Productos */}
          {results.productos.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Package className="size-3" /> Productos
                </p>
              </div>
              {results.productos.map(p => (
                <button
                  key={p.id}
                  onClick={() => onNavigate('/dashboard/inventario')}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                      {p.nombre.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {p.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.stock} en stock
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground shrink-0">
                    {formatCurrency(p.precio)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              {totalResults} resultado
              {totalResults !== 1 ? 's' : ''} para &quot;{query}&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
