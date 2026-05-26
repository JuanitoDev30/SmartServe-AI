import {
  estadoConfig,
  itemVariants,
} from '@/features/dashboard/shared/constants/timeFilterLabels';
import { PedidoReciente } from '@/features/overView/schemas/types';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PedidosRecientesProps {
  pedidos: PedidoReciente[];
}

export function PedidosRecientes({ pedidos }: PedidosRecientesProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Pedidos Recientes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Últimos 5 pedidos
          </p>
        </div>
        <Link
          href="/dashboard/pedido"
          className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
        >
          Ver todos <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {pedidos.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No hay pedidos recientes
          </div>
        ) : (
          pedidos.slice(0, 5).map((pedido, index) => {
            const config = estadoConfig[pedido.estado] ?? {
              label: pedido.estado,
              color: 'text-gray-600',
              bg: 'bg-gray-500/10',
            };
            const initials = pedido.cliente?.nombre
              ?.split(' ')
              .map((n: string) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {pedido.cliente?.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pedido.items?.length} producto
                      {pedido.items?.length !== 1 ? 's' : ''} ·{' '}
                      {formatDate(pedido.creadoEn)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      config.bg,
                      config.color,
                    )}
                  >
                    {config.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground tabular-nums min-w-[80px] text-right">
                    {formatCurrency(Number(pedido.total))}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
