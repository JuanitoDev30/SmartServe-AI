'use client';

import { type Pedido, type EstadoPedido } from '@/lib/validations/order';
import { cn } from '@/lib/utils';
import {
  X,
  User,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Package,
  FileText,
} from 'lucide-react';

const statusConfig: Record<EstadoPedido, { label: string; bgColor: string }> = {
  PENDIENTE: { label: 'Pendiente', bgColor: 'bg-orange-500' },
  CONFIRMADO: { label: 'Confirmado', bgColor: 'bg-blue-500' },
  EN_PREPARACION: { label: 'En Preparacion', bgColor: 'bg-blue-500' },
  EN_CAMINO: { label: 'En Camino', bgColor: 'bg-cyan-500' },
  ENTREGADO: { label: 'Completado', bgColor: 'bg-emerald-500' },
  CANCELADO: { label: 'Cancelado', bgColor: 'bg-red-500' },
};

const metodoPagoLabels: Record<string, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
  PSE: 'PSE',
};

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Pedido | null;
}

export function OrderViewModal({
  isOpen,
  onClose,
  order,
}: OrderViewModalProps) {
  if (!isOpen || !order) return null;

  const config = statusConfig[order.estado];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl mx-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">
              Pedido #{order.id}
            </h2>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white',
                config.bgColor,
              )}
            >
              {config.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <Package className="size-4" />
              <h3 className="font-medium">Productos</h3>
            </div>
            <div className="rounded-xl bg-muted/50 divide-y divide-border">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {item.producto.nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.cantidad} x ${item.precioUnitario.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-medium text-foreground">
                    ${item.subtotalItem.toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 bg-muted/50">
                <p className="font-semibold text-foreground">Total</p>
                <p className="font-semibold text-primary text-lg">
                  ${order.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <User className="size-4" />
              <h3 className="font-medium">Cliente</h3>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 space-y-3">
              <p className="font-medium text-foreground">
                {order.cliente.nombre}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                {order.cliente.telefono}
              </div>
              {order.cliente.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  {order.cliente.email}
                </div>
              )}
            </div>
          </div>

          {/* Direccion */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="size-4" />
              <h3 className="font-medium">Direccion de Entrega</h3>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-foreground">{order.direccion}</p>
            </div>
          </div>

          {/* Metodo de Pago */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <CreditCard className="size-4" />
              <h3 className="font-medium">Metodo de Pago</h3>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-foreground">
                {metodoPagoLabels[order.metodoPago] || order.metodoPago}
              </p>
            </div>
          </div>

          {/* Notas */}
          {order.notas && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <FileText className="size-4" />
                <h3 className="font-medium">Notas</h3>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-muted-foreground">{order.notas}</p>
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="size-4" />
              <h3 className="font-medium">Fechas</h3>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Creado</span>
                <span className="text-foreground">
                  {new Date(order.creadoEn).toLocaleString('es-ES', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Actualizado</span>
                <span className="text-foreground">
                  {new Date(order.actualizadoEn).toLocaleString('es-ES', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
