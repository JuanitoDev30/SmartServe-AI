'use client';
import { ReporteVentas } from '@/features/reportes/schemas/reportesSchema';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, ShoppingBag, TrendingUp } from 'lucide-react';
import { metodoPagoColors } from '../../shared/constants/reporteConstants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/dashboard/statCard';
import { DataTable } from '@/components/dashboard/dataTable';

interface ReporteVentasViewProps {
  data: ReporteVentas;
}

export function ReporteVentasView({ data }: ReporteVentasViewProps) {
  const stats = [
    {
      titulo: 'Total Ventas',
      valor: data.totalVentas.toString(),
      icon: <ShoppingBag />,
      iconBg: 'bg-gradient-to-br from-primary to-primary/80',
    },
    {
      titulo: 'Ingresos Brutos',
      valor: formatCurrency(data.totalBruto),
      icon: <DollarSign />,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      titulo: 'Total IVA',
      valor: formatCurrency(data.totalIva),
      icon: <FileText />,
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    {
      titulo: 'Ingresos Netos',
      valor: formatCurrency(data.totalNeto),
      icon: <TrendingUp />,
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
  ];

  const columns = [
    {
      key: 'fecha',
      header: 'Fecha',
      headerClassName: 'text-left',
      className: 'text-sm text-muted-foreground whitespace-nowrap',
      render: (v: ReporteVentas['ventas'][0]) => formatDate(v.fecha),
    },
    {
      key: 'cliente',
      header: 'Cliente',
      headerClassName: 'text-left',
      className: 'text-sm font-medium text-foreground',
      render: (v: ReporteVentas['ventas'][0]) => v.cliente,
    },
    {
      key: 'productos',
      header: 'Productos',
      headerClassName: 'text-left',
      className: 'text-sm text-muted-foreground max-w-[200px] truncate',
      render: (v: ReporteVentas['ventas'][0]) =>
        v.productos.map(p => `${p.nombre} x${p.cantidad}`).join(', '),
    },
    {
      key: 'metodo',
      header: 'Método',
      headerClassName: 'text-left',
      render: (v: ReporteVentas['ventas'][0]) => {
        const colors = metodoPagoColors[v.metodoPago] ?? {
          bg: 'bg-muted',
          text: 'text-muted-foreground',
        };
        return (
          <Badge variant="custom" className={cn(colors.bg, colors.text)}>
            {v.metodoPago}
          </Badge>
        );
      },
    },
    {
      key: 'base',
      header: 'Base',
      headerClassName: 'text-right',
      className: 'text-sm text-right text-foreground tabular-nums',
      render: (v: ReporteVentas['ventas'][0]) => formatCurrency(v.subtotal),
    },
    {
      key: 'iva',
      header: 'IVA',
      headerClassName: 'text-right',
      className: 'text-sm text-right text-amber-500 tabular-nums',
      render: (v: ReporteVentas['ventas'][0]) => formatCurrency(v.iva),
    },
    {
      key: 'total',
      header: 'Total',
      headerClassName: 'text-right',
      className:
        'text-sm text-right font-semibold text-foreground tabular-nums',
      render: (v: ReporteVentas['ventas'][0]) => formatCurrency(v.total),
    },
  ];

  const footer = (
    <tr className="bg-gradient-to-r from-muted/50 to-muted/30 border-t border-border">
      <td colSpan={4} className="px-4 py-4 text-sm font-bold text-foreground">
        TOTALES
      </td>
      <td className="px-4 py-4 text-sm text-right font-bold text-foreground tabular-nums">
        {formatCurrency(data.totalNeto)}
      </td>
      <td className="px-4 py-4 text-sm text-right font-bold text-amber-500 tabular-nums">
        {formatCurrency(data.totalIva)}
      </td>
      <td className="px-4 py-4 text-sm text-right font-bold text-foreground tabular-nums">
        {formatCurrency(data.totalBruto)}
      </td>
    </tr>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/*  stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.titulo} {...stat} />
        ))}
      </div>

      {/* Table */}
      <DataTable
        title="Detalle de Ventas"
        subtitle={`${data.ventas.length} transacciones`}
        columns={columns}
        data={data.ventas}
        footer={footer}
      />
    </motion.div>
  );
}
