import { ReporteProductos } from '@/features/reportes/schemas/reportesSchema';
import {
  getIvaColor,
  getStockStatus,
} from '../../shared/constants/reporteConstants';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/dashboard/dataTable';

interface ReporteProductosViewProps {
  data: ReporteProductos;
}

export function ReporteProductosView({ data }: ReporteProductosViewProps) {
  const columns = [
    {
      key: 'index',
      header: '#',
      headerClassName: 'text-left w-12',
      className: 'text-sm text-muted-foreground',
      render: (_: ReporteProductos['productos'][0], index: number) => index + 1,
    },
    {
      key: 'producto',
      header: 'Producto',
      headerClassName: 'text-left',
      render: (p: ReporteProductos['productos'][0]) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {p.nombre.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-foreground">
            {p.nombre}
          </span>
        </div>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      headerClassName: 'text-left',
      className: 'text-sm text-muted-foreground',
      render: (p: ReporteProductos['productos'][0]) => p.categoria,
    },
    {
      key: 'iva',
      header: 'IVA',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (p: ReporteProductos['productos'][0]) => {
        const colors = getIvaColor(p.ivaPercent);
        return (
          <Badge variant="custom" className={cn(colors.bg, colors.text)}>
            {p.ivaPercent}%
          </Badge>
        );
      },
    },
    {
      key: 'vendidas',
      header: 'Uds Vendidas',
      headerClassName: 'text-center',
      className: 'text-sm text-center font-medium text-foreground tabular-nums',
      render: (p: ReporteProductos['productos'][0]) => p.cantidadVendida,
    },
    {
      key: 'pedidos',
      header: 'Pedidos',
      headerClassName: 'text-center',
      className: 'text-sm text-center text-foreground tabular-nums',
      render: (p: ReporteProductos['productos'][0]) => p.pedidos,
    },
    {
      key: 'stock',
      header: 'Stock',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (p: ReporteProductos['productos'][0]) => {
        const status = getStockStatus(p.stockActual);
        return (
          <Badge
            variant="custom"
            className={cn(status.bg, status.text, status.border)}
          >
            {p.stockActual} uds
          </Badge>
        );
      },
    },
    {
      key: 'ingresos',
      header: 'Ingresos',
      headerClassName: 'text-right',
      className:
        'text-sm text-right font-semibold text-foreground tabular-nums',
      render: (p: ReporteProductos['productos'][0]) =>
        formatCurrency(p.ingresos),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DataTable
        title="Productos Vendidos"
        subtitle={`${data.productos.length} productos`}
        columns={columns}
        data={data.productos}
      />
    </motion.div>
  );
}
