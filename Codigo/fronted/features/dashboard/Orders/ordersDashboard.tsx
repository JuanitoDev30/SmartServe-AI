'use client';
import { Input } from '@/components/ui/input';

import { usePedidosSocket } from '@/hooks/usePedidosSocket';
import { usePedidosStore } from '@/store/pedidosStore';
import { formatCurrency } from '@/lib/formatCurrency';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/useToast';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { OrderFormModal } from './orderFromModal';
import { OrderViewModal } from './orderViewModal';

import {
  type Pedido,
  type EstadoPedido,
} from '@/features/pedidos/schemas/orderSchema';
import { type PedidoFormValues } from '@/lib/validations/order';
import { formatDate } from '@/lib/format';
import { updateOrderAction } from '@/features/pedidos/actions/updateOrderActions';

// Status configuration
const statusConfig: Record<
  EstadoPedido,
  { label: string; color: string; bgColor: string }
> = {
  PENDIENTE: {
    label: 'Pendiente',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
  },
  CONFIRMADO: {
    label: 'Confirmado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  EN_PREPARACION: {
    label: 'En Proceso',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  EN_CAMINO: {
    label: 'En Camino',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500',
  },
  ENTREGADO: {
    label: 'Completado',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'text-red-600',
    bgColor: 'bg-red-500',
  },
};

type TabFilter = 'all' | 'PENDIENTE' | 'EN_PREPARACION' | 'ENTREGADO';

const tabFilters: { label: string; value: TabFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendientes', value: 'PENDIENTE' },
  { label: 'En Proceso', value: 'EN_PREPARACION' },
  { label: 'Completados', value: 'ENTREGADO' },
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
              changeType === 'positive' ? 'text-emerald-500' : 'text-red-500',
            )}
          >
            {change}
          </p>
        </div>
        <div className={cn('rounded-full p-3', iconBgColor)}>{icon}</div>
      </div>
    </div>
  );
}

export function OrdersDashboard() {
  usePedidosSocket();
  const pedidos = usePedidosStore(state => state.pedidos);
  const isConnected = usePedidosStore(state => state.isConnected);
  const isLoading = usePedidosStore(state => state.isLoading);

  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = useMemo(() => {
    const total = pedidos.length;
    const inProcess = pedidos.filter(
      o =>
        o.estado === 'EN_PREPARACION' ||
        o.estado === 'CONFIRMADO' ||
        o.estado === 'PENDIENTE' ||
        o.estado === 'EN_CAMINO',
    ).length;
    const completed = pedidos.filter(o => o.estado === 'ENTREGADO').length;
    const cancelled = pedidos.filter(o => o.estado === 'CANCELADO').length;

    return { total, inProcess, completed, cancelled };
  }, [pedidos]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = [...pedidos];

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'EN_PREPARACION') {
        result = result.filter(
          o =>
            o.estado === 'EN_PREPARACION' ||
            o.estado === 'CONFIRMADO' ||
            o.estado === 'EN_CAMINO',
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
          o.cliente.nombre.toLowerCase().includes(query) ||
          o.items.some(item =>
            item.producto.nombre.toLowerCase().includes(query),
          ),
      );
    }

    return result;
  }, [pedidos, activeTab, searchQuery]);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return filteredOrders.reduce((sum, order) => {
      const total = Number(order.total) || 0;
      return sum + total;
    }, 0);
  }, [filteredOrders]);

  const handleEdit = (order: Pedido) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleView = (order: Pedido) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleEditSubmit = async (data: PedidoFormValues) => {
    if (!selectedOrder) return;

    setIsSubmitting(true);
    try {
      const cleanData = {
        ...data,
        cliente: {
          ...data.cliente,
          email: data.cliente.email === '' ? undefined : data.cliente.email,
        },
      };
      const result = await updateOrderAction(selectedOrder.id, cleanData);

      if (!result.success) {
        console.error('Error al actualizar:', result.error);
        // toast.error(result.error) // si tienes un sistema de notificaciones
        toast({
          variant: 'destructive',
          title: 'Error al actualizar el pedido',
          description: result.error || 'Ocurrió un error inesperado',
          duration: 3000,
        });

        return;
      }

      console.log('Updating order:', selectedOrder.id, cleanData);

      toast({
        variant: 'default',
        title: 'Pedido actualizado',
        description: `El pedido ha sido actualizado exitosamente`,
        duration: 3000,
      });

      // The socket will automatically update the store when the server
      // emits 'pedido.actualizado' event
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsSubmitting(false);
      setEditModalOpen(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Gestion de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y monitorea todos los pedidos
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="size-4 text-emerald-500" />
                <span className="text-emerald-500">Conectado</span>
              </>
            ) : (
              <>
                <WifiOff className="size-4 text-red-500" />
                <span className="text-red-500">Desconectado</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
              placeholder="Buscar pedido..."
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
              {isLoading ? (
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
                        {order.cliente.nombre}
                      </td>
                      <td className="px-4 py-4 text-sm text-primary">
                        {mainProduct?.producto.nombre || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground text-center">
                        {totalQuantity}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        {formatCurrency(order.total)}
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
                        {formatDate(order.creadoEn)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleView(order)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            title="Ver"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => handleEdit(order)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            title="Editar"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {/* Total Row */}
              {!isLoading && filteredOrders.length > 0 && (
                <tr className="bg-muted/30">
                  <td className="px-4 py-4 text-sm font-semibold text-foreground">
                    TOTAL
                  </td>
                  <td colSpan={3}></td>
                  <td className="px-4 py-4 text-sm font-semibold text-primary">
                    {Number(totalAmount).toLocaleString('es-CO')}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <OrderFormModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleEditSubmit}
        order={selectedOrder}
        isLoading={isSubmitting}
      />

      {/* View Modal */}
      <OrderViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
}
