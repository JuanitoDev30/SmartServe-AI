'use client';

import { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  type Cliente,
  type EstadoCliente,
} from '@/features/clientes/schemas/clientSchema';
import { getClienteByIdAction } from '@/features/clientes/actions/getClientByIdActions';

interface ClienteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string | null;
}

const estadoConfig: Record<
  EstadoCliente,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  ACTIVO: { label: 'Activo', variant: 'default' },
  INACTIVO: { label: 'Inactivo', variant: 'secondary' },
  SUSPENDIDO: { label: 'Suspendido', variant: 'destructive' },
};

const pedidoEstadoConfig: Record<string, { label: string; color: string }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-orange-500' },
  CONFIRMADO: { label: 'Confirmado', color: 'bg-blue-500' },
  EN_PREPARACION: { label: 'En Preparación', color: 'bg-blue-500' },
  EN_CAMINO: { label: 'En Camino', color: 'bg-cyan-500' },
  ENTREGADO: { label: 'Entregado', color: 'bg-emerald-500' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500' },
};

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}
function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}

export function ClienteDetailModal({
  isOpen,
  onClose,
  clienteId,
}: ClienteDetailModalProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !clienteId) return;

    const fetchCliente = async () => {
      setIsLoading(true);
      try {
        const result = await getClienteByIdAction(clienteId);
        if (result.success && result.data) {
          setCliente(result.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [isOpen, clienteId]);

  // Limpiar al cerrar
  const handleClose = () => {
    setCliente(null);
    onClose();
  };

  if (!isOpen) return null;

  // Stats calculadas
  const pedidos = (cliente as any)?.pedidos ?? [];
  const totalGastado = pedidos.reduce(
    (sum: number, p: any) => sum + Number(p.total),
    0,
  );
  const ultimoPedido = pedidos[0] ?? null;
  const pedidosRecientes = pedidos.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl mx-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-xl font-semibold text-foreground">
            Detalles del Cliente
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : !cliente ? (
            <p className="text-center text-muted-foreground py-12">
              No se encontró el cliente
            </p>
          ) : (
            <>
              {/* Info principal */}
              <div className="flex items-start gap-4">
                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                  {cliente.nombre
                    .split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">
                      {cliente.nombre}
                    </h3>
                    <Badge variant={estadoConfig[cliente.estado].variant}>
                      {estadoConfig[cliente.estado].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Registrado el {formatDate(cliente.creadoEn)}
                  </p>
                </div>
              </div>

              {/* Contacto */}
              <div className="rounded-xl border border-border p-4 space-y-3">
                <h4 className="text-sm font-medium text-foreground">
                  Información de Contacto
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-4 text-muted-foreground shrink-0" />
                    <span>{cliente.telefono}</span>
                  </div>
                  {cliente.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                  )}
                  {cliente.direccionPrincipal && (
                    <div className="flex items-start gap-2 text-sm sm:col-span-2">
                      <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{cliente.direccionPrincipal}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border p-4 text-center space-y-1">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <ShoppingBag className="size-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {pedidos.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pedidos</p>
                </div>
                <div className="rounded-xl border border-border p-4 text-center space-y-1">
                  <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                    <DollarSign className="size-4 text-emerald-500" />
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(totalGastado)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total gastado</p>
                </div>
                <div className="rounded-xl border border-border p-4 text-center space-y-1">
                  <div className="size-8 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto">
                    <Clock className="size-4 text-orange-500" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {ultimoPedido
                      ? formatDate(ultimoPedido.creadoEn)
                      : 'Sin pedidos'}
                  </p>
                  <p className="text-xs text-muted-foreground">Último pedido</p>
                </div>
              </div>

              {/* Pedidos recientes */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">
                  Pedidos Recientes
                </h4>
                {pedidosRecientes.length === 0 ? (
                  <div className="rounded-xl border border-border p-6 text-center text-muted-foreground text-sm">
                    Este cliente aún no tiene pedidos
                  </div>
                ) : (
                  <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
                    {pedidosRecientes.map((pedido: any) => {
                      const config = pedidoEstadoConfig[pedido.estado] ?? {
                        label: pedido.estado,
                        color: 'bg-gray-500',
                      };
                      return (
                        <div
                          key={pedido.id}
                          className="flex items-center justify-between px-4 py-3"
                        >
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground">
                              #{pedido.id.slice(0, 8)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(pedido.creadoEn)}
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
