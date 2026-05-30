import { itemVariants } from '@/features/dashboard/shared/constants/timeFilterLabels';
import { TopProducto } from '@/features/ventas/schemas/ventasSchema';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface TopProductosProps {
  productos: TopProducto[];
}

export function TopProductos({ productos }: TopProductosProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Top Productos
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Este mes</p>
        </div>
        <Link
          href="/dashboard/inventario"
          className="text-xs text-primary hover:underline font-medium"
        >
          Ver todos
        </Link>
      </div>

      {productos.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
          No hay datos de productos para este mes
        </div>
      ) : (
        <div className="space-y-4">
          {productos.slice(0, 5).map((producto, index) => {
            const maxIngresos = productos[0]?.ingresos ?? 1;
            const porcentaje =
              maxIngresos > 0 ? (producto.ingresos / maxIngresos) * 100 : 0;

            return (
              <motion.div
                key={producto.id}
                className="space-y-1.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[120px]">
                      {producto.nombre}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {producto.cantidadTotal} uds
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentaje}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                </div>
                <p className="text-xs font-semibold text-foreground text-right tabular-nums">
                  {formatCurrency(producto.ingresos)}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
