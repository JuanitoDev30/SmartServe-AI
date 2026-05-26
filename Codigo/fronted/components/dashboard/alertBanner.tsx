import { motion } from 'framer-motion';

import {
  PedidoReciente,
  ProductoStockBajo,
} from '@/features/overView/schemas/types';
import { Bell, ChevronRight, Clock, Package, X } from 'lucide-react';
import Link from 'next/link';

interface AlertBannerProps {
  pedidosUrgentes: PedidoReciente[];
  stockCritico: ProductoStockBajo[];
  onDimiss: () => void;
}

export function AlertBanner({
  onDimiss,
  pedidosUrgentes,
  stockCritico,
}: AlertBannerProps) {
  const totalAlerts = pedidosUrgentes.length + stockCritico.length;

  if (totalAlerts === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
            <Bell className="size-5 text-orange-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {totalAlerts}{' '}
              {totalAlerts === 1 ? 'alerta requiere' : 'alertas requieren'} tu
              atención
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              {pedidosUrgentes.length > 0 && (
                <Link
                  href="/dashboard/pedido?estado=PENDIENTE"
                  className="flex items-center gap-1 text-orange-600 hover:underline"
                >
                  <Clock className="size-3" />
                  {pedidosUrgentes.length} pedido
                  {pedidosUrgentes.length !== 1 ? 's' : ''} pendiente
                  {pedidosUrgentes.length !== 1 ? 's' : ''}
                  <ChevronRight className="size-3" />
                </Link>
              )}
              {stockCritico.length > 0 && (
                <Link
                  href="/dashboard/productos?stock=bajo"
                  className="flex items-center gap-1 text-red-600 hover:underline"
                >
                  <Package className="size-3" />
                  {stockCritico.length} producto
                  {stockCritico.length !== 1 ? 's' : ''} con stock crítico
                  <ChevronRight className="size-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onDimiss}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Cerrar alerta"
        >
          <X className="size-4 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}
