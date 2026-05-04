'use client';
import { Input } from '@/components/ui/input';
import { EstadoPedido, Pedido } from '@/features/pedidos/schemas/orderSchema';
import { usePedidosSocket } from '@/hooks/usePedidosSocket';
import { formatCurrency } from '@/lib/formatCurrency';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  Package,
  Search,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Status configuration
const statusConfig: Record<EstadoPedido, { label: string; bgColor: string }> = {
  PENDIENTE: { label: 'Pendiente', bgColor: 'bg-orange-500' },
  CONFIRMADO: { label: 'Confirmado', bgColor: 'bg-blue-500' },
  EN_PREPARACION: { label: 'En Preparación', bgColor: 'bg-blue-500' },
  EN_CAMINO: { label: 'En Camino', bgColor: 'bg-purple-500' },
  ENTREGADO: { label: 'Entregado', bgColor: 'bg-emerald-500' },
  CANCELADO: { label: 'Cancelado', bgColor: 'bg-red-500' },
};

const tabFilters: { label: string; value: EstadoPedido | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendientes', value: 'PENDIENTE' },
  { label: 'En Proceso', value: 'EN_PREPARACION' },
  { label: 'Entregados', value: 'ENTREGADO' },
];

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  iconBgColor: string;
}

function StatsCard({
  title,
  value,
  change,
  changeType,
  icon,
  iconBgColor,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
          <p
            className={cn(
              'text-sm font-medium',
              changeType === 'positive' ? 'text-emerald-500 ' : 'text-red-500',
            )}
          >
            {change}
          </p>
        </div>
        <div
          className={cn(
            'size-10 rounded-full flex items-center justify-center',
            iconBgColor,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export function OrdersDashboard() {
  const { pedidos, isLoading, isConnected } = usePedidosSocket();
  const [activeTab, setActiveTab] = useState<EstadoPedido | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  //  useEffect(() => {
  //   async function fetchOrders() {
  //     setLoading(true)
  //     try {
  //       const response = await ordersService.getOrders({ limit: 100 })
  //       setOrders(response.data)
  //     } catch (error) {
  //       console.error("Error fetching orders:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchOrders()
  // }, [])

  const stats = useMemo(
    () => ({
      total: pedidos.length,
      inProcess: pedidos.filter(
        p => p.estado === 'EN_PREPARACION' || p.estado === 'CONFIRMADO',
      ).length,
      completed: pedidos.filter(p => p.estado === 'ENTREGADO').length,
      cancelled: pedidos.filter(p => p.estado === 'CANCELADO').length,
    }),
    [pedidos],
  );

  const filteredOrders = useMemo(() => {
    let result = [...pedidos];

    if (activeTab !== 'all') {
      if (activeTab === 'EN_PREPARACION') {
        result = result.filter(
          p => p.estado === 'EN_PREPARACION' || p.estado === 'CONFIRMADO',
        );
      } else {
        result = result.filter(p => p.estado === activeTab);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.id.toLowerCase().includes(query) ||
          p.cliente.nombre.toLowerCase().includes(query) ||
          p.items.some(i => i.producto.nombre.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [pedidos, activeTab, searchQuery]);

  const totalAmount = useMemo(
    () => filteredOrders.reduce((sum, p) => sum + Number(p.total), 0),
    [filteredOrders],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Gestión de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y monitorea todos los pedidos
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {isConnected ? (
            <>
              <Wifi className="size-4 text-emerald-500" />
              <span className="text-emerald-500">En vivo</span>
            </>
          ) : (
            <>
              <WifiOff className="size-4 text-red-500" />
              <span className="text-red-500">Desconectado</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pedidos"
          value={stats.total.toLocaleString()}
          icon={<Package className="size-5 text-muted-foreground" />}
          change="+5% desde ayer"
          changeType="positive"
          iconBgColor="bg-muted"
        />
        <StatsCard
          title="En Proceso"
          value={stats.inProcess.toLocaleString()}
          icon={<Clock className="size-5 text-orange-500" />}
          change="+10% desde ayer"
          changeType="positive"
          iconBgColor="bg-muted"
        />
        <StatsCard
          title="Completados"
          value={stats.completed.toLocaleString()}
          icon={<CheckCircle2 className="size-5 text-emerald-500" />}
          change="+3% desde ayer"
          changeType="positive"
          iconBgColor="bg-muted"
        />
        <StatsCard
          title="Cancelados"
          value={stats.cancelled.toLocaleString()}
          icon={<XCircle className="size-5 text-red-500" />}
          change="-2% desde ayer"
          changeType="negative"
          iconBgColor="bg-muted"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {tabFilters.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === tab.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar pedido..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-border">
                {[
                  'ID Pedido',
                  'Cliente',
                  'Teléfono',
                  'Producto',
                  'Cantidad',
                  'Total',
                  'Estado',
                  'Fecha',
                  'Acciones',
                ].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Cargando pedidos...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                filteredOrders.map((pedido: Pedido) => {
                  const mainProduct = pedido.items[0];
                  const totalQuantity = pedido.items.reduce(
                    (sum, i) => sum + i.cantidad,
                    0,
                  );
                  const config = statusConfig[pedido.estado];

                  return (
                    <tr
                      key={pedido.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        #{pedido.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {pedido.cliente.nombre}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {pedido.cliente.telefono}
                      </td>
                      <td className="px-4 py-4 text-sm text-primary">
                        {mainProduct?.producto.nombre || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground text-center">
                        {totalQuantity}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        {formatCurrency(Number(pedido.total))}{' '}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white',
                            config.bgColor,
                          )}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {new Date(pedido.creadoEn).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Ver
                          </button>
                          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {!isLoading && filteredOrders.length > 0 && (
                <tr className="bg-muted/30">
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-sm font-semibold text-foreground"
                  >
                    TOTAL
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-primary">
                    {formatCurrency(totalAmount)}
                  </td>
                  <td colSpan={3} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
