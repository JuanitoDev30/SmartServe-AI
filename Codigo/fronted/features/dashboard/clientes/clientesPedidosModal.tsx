'use client';
import { useState, useMemo } from 'react';
import {
  X,
  ShoppingBag,
  DollarSign,
  Package,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';

import { Pedido } from '@/lib/validations/order';
import { useClienteData } from '@/hooks/useClient';
import {
  ESTADO_PEDIDO_CONFIG,
  ESTADO_PEDIDO_FILTROS,
} from '../shared/constants/pedidoConstants';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
interface ClientePedidosModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string | null;
}

interface ClientePedidosModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string | null;
}

export function ClientePedidosModal({
  isOpen,
  onClose,
  clienteId,
}: ClientePedidosModalProps) {
  const { cliente, isLoading, reset } = useClienteData(clienteId, isOpen);

  const [expandedPedidos, setExpandedPedidos] = useState<Set<string>>(
    new Set(),
  );
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const handleClose = () => {
    reset();
    setExpandedPedidos(new Set());
    setEstadoFiltro('todos');
    setSearchTerm('');
    onClose();
  };

  const togglePedido = (id: string) =>
    setExpandedPedidos(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const pedidos = useMemo<Pedido[]>(() => cliente?.pedidos ?? [], [cliente]);

  const { totalGastado, pedidosEntregados } = useMemo(
    () => ({
      totalGastado: pedidos.reduce((sum, p) => sum + Number(p.total), 0),
      pedidosEntregados: pedidos.filter(p => p.estado === 'ENTREGADO').length,
    }),
    [pedidos],
  );

  const pedidosFiltrados = useMemo(
    () =>
      pedidos.filter(p => {
        const matchEstado =
          estadoFiltro === 'todos' || p.estado === estadoFiltro;
        const term = searchTerm.toLowerCase();
        const matchSearch =
          p.id.toLowerCase().includes(term) ||
          p.items.some(i => i.producto.nombre.toLowerCase().includes(term));
        return matchEstado && matchSearch;
      }),
    [pedidos, estadoFiltro, searchTerm],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl mx-4">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Pedidos de {cliente?.nombre ?? '...'}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Historial completo de pedidos
              </p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Stats rápidas */}
          {!isLoading && cliente && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <StatChip value={pedidos.length} label="Total pedidos" />
              <StatChip
                value={pedidosEntregados}
                label="Entregados"
                valueClassName="text-emerald-500"
              />
              <StatChip
                value={formatCurrency(totalGastado)}
                label="Total gastado"
                valueClassName="text-sm"
              />
            </div>
          )}

          {/* Filtros */}
          {!isLoading && pedidos.length > 0 && (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID o producto..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {ESTADO_PEDIDO_FILTROS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setEstadoFiltro(f.value)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      estadoFiltro === f.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : pedidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="size-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">
                Este cliente aún no tiene pedidos
              </p>
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No hay pedidos con ese filtro
            </div>
          ) : (
            pedidosFiltrados.map(pedido => {
              const config = ESTADO_PEDIDO_CONFIG[pedido.estado] ?? {
                label: pedido.estado,
                color: 'bg-gray-500',
              };
              const isExpanded = expandedPedidos.has(pedido.id);

              return (
                <div
                  key={pedido.id}
                  className="rounded-xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() => togglePedido(pedido.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        #{pedido.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(pedido.creadoEn)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white',
                          config.color,
                        )}
                      >
                        {config.label}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(Number(pedido.total))}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border bg-muted/20 px-4 py-3 space-y-3">
                      <div className="space-y-2">
                        {pedido.items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Package className="size-3.5 text-muted-foreground" />
                              <span className="text-foreground">
                                {item.producto.nombre}
                              </span>
                              <span className="text-muted-foreground">
                                x{item.cantidad}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {formatCurrency(Number(item.subtotalItem))}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-border space-y-1 text-xs text-muted-foreground">
                        <p>📍 {pedido.direccion}</p>
                        <p>💳 {pedido.metodoPago}</p>
                        {pedido.notas && <p>📝 {pedido.notas}</p>}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-sm font-medium text-foreground">
                          Total
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {formatCurrency(Number(pedido.total))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// Chip de stat compacto para el header del modal
interface StatChipProps {
  value: string | number;
  label: string;
  valueClassName?: string;
}

function StatChip({ value, label, valueClassName }: StatChipProps) {
  return (
    <div className="rounded-lg bg-muted/50 p-3 text-center">
      <p className={cn('text-xl font-bold text-foreground', valueClassName)}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
