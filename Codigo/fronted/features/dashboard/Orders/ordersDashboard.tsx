'use client';
import { Order, OrderStatus } from '@/features/pedidos/schemas/orderSchema';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
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
    </div>
  );
}
