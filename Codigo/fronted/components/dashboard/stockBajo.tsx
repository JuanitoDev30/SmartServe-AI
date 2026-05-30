import { itemVariants } from '@/features/dashboard/shared/constants/timeFilterLabels';
import { ProductoStockBajo } from '@/features/overView/schemas/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';

interface StockBajoProps {
  productos: ProductoStockBajo[];
}

export function StockBajo({ productos }: StockBajoProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-orange-500/10 flex items-center justify-center">
            <AlertTriangle className="size-3.5 text-orange-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Stock Bajo</h3>
        </div>
        <Link
          href="/dashboard/inventario"
          className="text-xs text-primary hover:underline font-medium"
        >
          Ver todos
        </Link>
      </div>

      <div className="divide-y divide-border max-h-[280px] overflow-y-auto">
        {productos.length === 0 ? (
          <div className="px-4 py-8 text-xs text-muted-foreground text-center">
            <CheckCircle className="size-8 text-emerald-500 mx-auto mb-2" />
            <p>Todos los productos tienen stock suficiente</p>
          </div>
        ) : (
          productos.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Package className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate max-w-[120px]">
                  {producto.nombre}
                </span>
              </div>
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums',
                  producto.stock <= 2
                    ? 'bg-red-500/10 text-red-600'
                    : 'bg-orange-500/10 text-orange-600',
                )}
              >
                {producto.stock} uds
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
