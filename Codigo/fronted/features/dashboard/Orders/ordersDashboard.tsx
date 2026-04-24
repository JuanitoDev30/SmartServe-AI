'use client';
import { Input } from '@/components/ui/input';
import { Order, OrderStatus } from '@/features/pedidos/schemas/orderSchema';
import { formatCurrency } from '@/lib/formatCurrency';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  Package,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// Status configuration
const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: 'Pendiente',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
  },
  confirmed: {
    label: 'Confirmado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  preparing: {
    label: 'En Proceso',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  ready: {
    label: 'Listo',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
  },
  delivered: {
    label: 'Completado',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-600',
    bgColor: 'bg-red-500',
  },
};

const tabFilters: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'En Proceso', value: 'preparing' },
  { label: 'Completados', value: 'delivered' },
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
      </div>
    </div>
  );
}

export function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
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

  const stats = useMemo(() => {
    const total = orders.length;
    const inProcess = orders.filter(
      o => o.estado === 'preparing' || o.estado === 'confirmed',
    ).length;
    const completed = orders.filter(o => o.estado === 'delivered').length;
    const cancelled = orders.filter(o => o.estado === 'cancelled').length;

    return { total, inProcess, completed, cancelled };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'preparing') {
        result = result.filter(
          o => o.estado === 'preparing' || o.estado === 'confirmed',
        );
      } else {
        result = result.filter(o => o.estado === activeTab);
      }
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        o =>
          o.id.toLowerCase().includes(query) ||
          o.usuarioNombre.toLowerCase().includes(query) ||
          o.items.some(item => item.nombre.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  }, [filteredOrders]);

  const handleDelete = async (orderId: string) => {
    // In a real app, this would call the API
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Gestion de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y monitorea todos los pedidos
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="size-4" />
          Nuevo Pedido
        </button>
      </div>

      {/* Stats cards */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pedidos"
          value={stats.total.toLocaleString()}
          change="+18% vs mes anterior"
          changeType="positive"
          icon={<Package className="size-5 text-white" />}
          iconBgColor="bg-primary"
        />

        <StatsCard
          title="En Proceso"
          value={stats.inProcess.toLocaleString()}
          change="+12% vs mes anterior"
          changeType="positive"
          icon={<Clock className="size-5 text-white" />}
          iconBgColor="bg-orange-500"
        />
        <StatsCard
          title="Completados"
          value={stats.completed.toLocaleString()}
          change="+25% vs mes anterior"
          changeType="positive"
          icon={<CheckCircle2 className="size-5 text-white" />}
          iconBgColor="bg-emerald-500"
        />
        <StatsCard
          title="Cancelados"
          value={stats.cancelled.toLocaleString()}
          change="-8% vs mes anterior"
          changeType="negative"
          icon={<XCircle className="size-5 text-white" />}
          iconBgColor="bg-red-500"
        />
      </div>

      {/* Table Section */}

      <div className="rounded-xl border border-border bg-card">
        {/* Tabs and Search */}
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
              type="text"
              placeholder="Buscar Pedido..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:w-64"
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  ID Pedido
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Monto
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
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
                    colSpan={8}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const mainProduct = order.items[0];
                  const totalQuantity = order.items.reduce(
                    (sum, item) => sum + item.cantidad,
                    0,
                  );
                  const config = statusConfig[order.estado];

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        #{order.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {order.usuarioNombre}
                      </td>
                      <td className="px-4 py-4 text-sm text-primary">
                        {mainProduct?.nombre || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground text-center">
                        {totalQuantity}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        {formatCurrency(order.totalAmount)}
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
                        {new Date(order.createdAt)
                          .toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                          .replace(/\//g, '-')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            title="Ver"
                          >
                            Ver
                          </button>
                          <button
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            title="Editar"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {/* Total Row */}
              {!loading && filteredOrders.length > 0 && (
                <tr className="bg-muted/30">
                  <td className="px-4 py-4 text-sm font-semibold text-foreground">
                    TOTAL
                  </td>
                  <td colSpan={3}></td>
                  <td className="px-4 py-4 text-sm font-semibold text-primary">
                    {formatCurrency(totalAmount)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
