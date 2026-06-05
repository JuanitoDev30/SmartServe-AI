import { DataTable } from '@/components/dashboard/dataTable';
import { ReporteClientes } from '@/features/reportes/schemas/reportesSchema';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

interface ReporteClientesViewProps {
  data: ReporteClientes;
}

export function ReporteClientesView({ data }: ReporteClientesViewProps) {
  const columns = [
    {
      key: 'index',
      header: '#',
      headerClassName: 'text-left w-12',
      className: 'text-sm text-muted-foreground',
      render: (_: ReporteClientes['clientes'][0], index: number) => index + 1,
    },
    {
      key: 'cliente',
      header: 'Cliente',
      headerClassName: 'text-left',
      render: (c: ReporteClientes['clientes'][0]) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-primary/10">
            {c.nombre
              .split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {c.nombre}
            </p>
            <p className="text-xs text-muted-foreground">{c.telefono}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      headerClassName: 'text-left',
      className: 'text-sm text-muted-foreground',
      render: (c: ReporteClientes['clientes'][0]) => c.email ?? '—',
    },
    {
      key: 'pedidos',
      header: 'Pedidos',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (c: ReporteClientes['clientes'][0]) => (
        <span className="inline-flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
          {c.totalPedidos}
        </span>
      ),
    },
    {
      key: 'ticket',
      header: 'Ticket Promedio',
      headerClassName: 'text-right',
      className: 'text-sm text-right text-foreground tabular-nums',
      render: (c: ReporteClientes['clientes'][0]) =>
        formatCurrency(c.ticketPromedio),
    },
    {
      key: 'total',
      header: 'Total Gastado',
      headerClassName: 'text-right',
      className:
        'text-sm text-right font-semibold text-emerald-600 tabular-nums',
      render: (c: ReporteClientes['clientes'][0]) =>
        formatCurrency(c.totalGastado),
    },
    {
      key: 'ultima',
      header: 'Última Compra',
      headerClassName: 'text-right',
      className: 'text-sm text-right text-muted-foreground',
      render: (c: ReporteClientes['clientes'][0]) => formatDate(c.ultimaCompra),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DataTable
        title="Clientes con Compras"
        subtitle={`${data.totalClientes} clientes`}
        columns={columns}
        data={data.clientes}
      />
    </motion.div>
  );
}
