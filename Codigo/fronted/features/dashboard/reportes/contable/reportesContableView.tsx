import { DataTable } from '@/components/dashboard/dataTable';
import { ReporteContable } from '@/features/reportes/schemas/reportesSchema';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Landmark, Percent, Receipt, TrendingUp } from 'lucide-react';
import { metodoPagoColors } from '../../shared/constants/reporteConstants';
import { cn } from '@/lib/utils';

interface ReporteContableViewProps {
  data: ReporteContable;
}

export function ReporteContableView({ data }: ReporteContableViewProps) {
  const columns = [
    {
      key: 'consecutivo',
      header: 'Consec.',
      headerClassName: 'text-left',
      className: 'text-xs font-mono text-muted-foreground',
      render: (v: ReporteContable['ventas'][0]) => v.consecutivo,
    },
    {
      key: 'fecha',
      header: 'Fecha',
      headerClassName: 'text-left',
      className: 'text-sm text-muted-foreground whitespace-nowrap',
      render: (v: ReporteContable['ventas'][0]) => v.fecha,
    },
    {
      key: 'cliente',
      header: 'Cliente',
      headerClassName: 'text-left',
      className: 'text-sm font-medium text-foreground',
      render: (v: ReporteContable['ventas'][0]) => v.cliente,
    },
    {
      key: 'nit',
      header: 'NIT/Tel',
      headerClassName: 'text-left',
      className: 'text-sm text-muted-foreground font-mono',
      render: (v: ReporteContable['ventas'][0]) => v.nit,
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      headerClassName: 'text-left',
      className: 'text-sm text-muted-foreground max-w-[180px] truncate',
      render: (v: ReporteContable['ventas'][0]) => v.descripcion,
    },
    {
      key: 'metodo',
      header: 'Método',
      headerClassName: 'text-left',
      render: (v: ReporteContable['ventas'][0]) => {
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
      render: (v: ReporteContable['ventas'][0]) =>
        formatCurrency(v.baseGravable),
    },
    {
      key: 'iva',
      header: 'IVA',
      headerClassName: 'text-right',
      className: 'text-sm text-right text-amber-500 tabular-nums',
      render: (v: ReporteContable['ventas'][0]) => formatCurrency(v.iva),
    },
    {
      key: 'total',
      header: 'Total',
      headerClassName: 'text-right',
      className:
        'text-sm text-right font-semibold text-foreground tabular-nums',
      render: (v: ReporteContable['ventas'][0]) => formatCurrency(v.total),
    },
  ];

  const footer = (
    <tr className="bg-gradient-to-r from-muted/50 to-muted/30 border-t border-border">
      <td colSpan={6} className="px-4 py-4 text-sm font-bold text-foreground">
        TOTALES
      </td>
      <td className="px-4 py-4 text-sm text-right font-bold text-foreground tabular-nums">
        {formatCurrency(data.resumenIva.totalBase)}
      </td>
      <td className="px-4 py-4 text-sm text-right font-bold text-amber-500 tabular-nums">
        {formatCurrency(data.resumenIva.totalIva)}
      </td>
      <td className="px-4 py-4 text-sm text-right font-bold text-foreground tabular-nums">
        {formatCurrency(data.resumenIva.totalBruto)}
      </td>
    </tr>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-muted/50 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <BookOpen className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">
                Declaración IVA — {data.periodo.mes} {data.periodo.anio}
              </h3>
              <p className="text-sm text-muted-foreground">{data.empresa}</p>
            </div>
          </div>
          <Receipt className="size-10 text-muted-foreground/20" />
        </div>

        {/* IVA Summary Grid */}
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Exento */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl bg-muted/30 p-5 border border-border/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                  <Percent className="size-4 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ventas Exentas (0%)
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {formatCurrency(data.resumenIva.baseExenta)}
              </p>
            </motion.div>

            {/* 5% */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-blue-500/5 p-5 border border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Landmark className="size-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Base Gravable 5%
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {formatCurrency(data.resumenIva.baseGravable5)}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                IVA: {formatCurrency(data.resumenIva.iva5)}
              </p>
            </motion.div>

            {/* 19% */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-amber-500/5 p-5 border border-amber-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="size-4 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Base Gravable 19%
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {formatCurrency(data.resumenIva.baseGravable19)}
              </p>
              <p className="text-sm text-amber-600 mt-1">
                IVA: {formatCurrency(data.resumenIva.iva19)}
              </p>
            </motion.div>
          </div>

          {/* Totals */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 pt-6 border-t border-border grid gap-4 sm:grid-cols-3"
          >
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Total Ingresos Brutos
              </p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {formatCurrency(data.resumenIva.totalBruto)}
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Total IVA a Declarar
              </p>
              <p className="text-2xl font-bold text-amber-500 tabular-nums">
                {formatCurrency(data.resumenIva.totalIva)}
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Base Neta (sin IVA)
              </p>
              <p className="text-2xl font-bold text-emerald-500 tabular-nums">
                {formatCurrency(data.resumenIva.totalBase)}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sales Book Table */}
      <DataTable
        title="Libro de Ventas"
        subtitle={`${data.ventas.length} transacciones`}
        columns={columns}
        data={data.ventas}
        footer={footer}
      />
    </motion.div>
  );
}
