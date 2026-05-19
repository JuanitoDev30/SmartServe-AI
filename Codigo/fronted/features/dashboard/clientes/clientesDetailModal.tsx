'use client';

import {
  X,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  DollarSign,
  Clock,
  Calendar,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  ESTADO_CLIENTE_CONFIG,
  ESTADO_PEDIDO_CONFIG,
} from '@/features/dashboard/shared/constants/pedidoConstants';

import { useClienteData } from '@/hooks/useClient';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { useMemo } from 'react';
import { Pedido } from '@/lib/validations/order';
interface ClienteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string | null;
}

export function ClienteDetailModal({
  isOpen,
  onClose,
  clienteId,
}: ClienteDetailModalProps) {
  const { cliente, isLoading, reset } = useClienteData(clienteId, isOpen);

  const handleClose = () => {
    reset();
    onClose();
  };

  const pedidos = useMemo<Pedido[]>(() => cliente?.pedidos ?? [], [cliente]);

  const { totalGastado, ultimoPedido, pedidosRecientes } = useMemo(
    () => ({
      totalGastado: pedidos.reduce((sum, p) => sum + Number(p.total), 0),
      ultimoPedido: pedidos[0] ?? null,
      pedidosRecientes: pedidos.slice(0, 5),
    }),
    [pedidos],
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
                    .join('') || <User className="size-7" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">
                      {cliente.nombre}
                    </h3>
                    <Badge
                      variant={ESTADO_CLIENTE_CONFIG[cliente.estado].variant}
                    >
                      {ESTADO_CLIENTE_CONFIG[cliente.estado].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
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
                <StatBox
                  icon={<ShoppingBag className="size-4 text-primary" />}
                  iconBg="bg-primary/10"
                  value={pedidos.length}
                  label="Pedidos"
                />
                <StatBox
                  icon={<DollarSign className="size-4 text-emerald-500" />}
                  iconBg="bg-emerald-500/10"
                  value={formatCurrency(totalGastado)}
                  label="Total gastado"
                  valueClassName="text-lg"
                />
                <StatBox
                  icon={<Clock className="size-4 text-orange-500" />}
                  iconBg="bg-orange-500/10"
                  value={
                    ultimoPedido
                      ? formatDate(ultimoPedido.creadoEn)
                      : 'Sin pedidos'
                  }
                  label="Último pedido"
                  valueClassName="text-sm"
                />
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
                    {pedidosRecientes.map(pedido => {
                      const config = ESTADO_PEDIDO_CONFIG[pedido.estado] ?? {
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

interface StatBoxProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
  valueClassName?: string;
}

function StatBox({ icon, iconBg, value, label, valueClassName }: StatBoxProps) {
  return (
    <div className="rounded-xl border border-border p-4 text-center space-y-1">
      <div
        className={cn(
          'size-8 rounded-full flex items-center justify-center mx-auto',
          iconBg,
        )}
      >
        {icon}
      </div>
      <p
        className={cn(
          'font-bold text-foreground',
          valueClassName ?? 'text-2xl',
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
