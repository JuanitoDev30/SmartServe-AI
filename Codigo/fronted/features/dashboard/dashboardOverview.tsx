'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Package,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils/formatters';

// Tus schemas originales — sin cambios
import type { Overview } from '../overView/schemas/overViewSchema';
import type { GraficaItem, TopProducto } from '../ventas/schemas/ventasSchema';
import { TimeFilter } from '../overView/schemas/types';
import {
  containerVariants,
  itemVariants,
} from './shared/constants/timeFilterLabels';
import { TimeFilterTabs } from '@/components/dashboard/timeFilterTab';
import { AlertBanner } from '@/components/dashboard/alertBanner';
import { StatCard } from '@/components/dashboard/statCard';
import { MiniStatCard } from '@/components/dashboard/miniStatCard';
import { IngresosChart } from '@/components/dashboard/ingresosChart';
import { TopProductos } from '@/components/dashboard/topProductos';
import { PedidosRecientes } from '@/components/dashboard/pedidosRecientes';
import { StockBajo } from '@/components/dashboard/stockBajo';

const META_MENSUAL_DEFAULT = 10_000_000;

interface DashboardOverviewProps {
  initialData: Overview | null;
  initialGrafica: GraficaItem[] | null;
  initialTopProductos: TopProducto[] | null;
  userName: string | null;
}

export function DashboardOverview({
  initialData,
  userName,
  initialGrafica,
  initialTopProductos,
}: DashboardOverviewProps) {
  const [data] = useState(initialData);
  const [grafica] = useState(initialGrafica ?? []);
  const [topProductos] = useState(initialTopProductos ?? []);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('semana');
  const [showAlert, setShowAlert] = useState(true);

  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  const graficaFormateada = useMemo(
    () =>
      grafica.map(g => ({
        ...g,
        label: new Intl.DateTimeFormat('es-CO', {
          day: '2-digit',
          month: 'short',
        }).format(new Date(g.label)),
        total: Number(g.total),
      })),
    [grafica],
  );

  // ── Métricas derivadas del schema existente ──────────────────────────────

  const ticketPromedio =
    data?.ingresos.hoy && data?.pedidos.hoy
      ? data.ingresos.hoy / data.pedidos.hoy
      : 0;

  // Pedidos urgentes = PENDIENTE de pedidosRecientes (any[])
  const pedidosUrgentes = useMemo(
    () =>
      (data?.pedidosRecientes ?? []).filter(
        (p: any) => p.estado === 'PENDIENTE',
      ),
    [data?.pedidosRecientes],
  );

  // Stock crítico = stock <= 2 unidades
  const stockCritico = useMemo(
    () => (data?.productosStockBajo ?? []).filter(p => p.stock <= 2),
    [data?.productosStockBajo],
  );

  // ── Valores según filtro de tiempo ───────────────────────────────────────
  // El schema solo tiene hoy/esteMes; la semana la aproximamos multiplicando hoy × 7
  const ingresosSegunFiltro =
    timeFilter === 'hoy'
      ? (data?.ingresos.hoy ?? 0)
      : timeFilter === 'semana'
        ? (data?.ingresos.hoy ?? 0) * 7
        : (data?.ingresos.esteMes ?? 0);

  const pedidosSegunFiltro =
    timeFilter === 'hoy'
      ? (data?.pedidos.hoy ?? 0)
      : timeFilter === 'semana'
        ? (data?.pedidos.hoy ?? 0) * 7
        : (data?.pedidos.hoy ?? 0) * 30;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {saludo}, {userName ?? 'Administrador'} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aqui tienes un resumen de tu negocio ·{' '}
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <TimeFilterTabs
          activeFilter={timeFilter}
          onFilterChange={setTimeFilter}
        />
      </motion.div>

      {/* Banner de alertas */}

      <AnimatePresence>
        {showAlert && (
          <AlertBanner
            pedidosUrgentes={pedidosUrgentes}
            stockCritico={stockCritico}
            onDimiss={() => setShowAlert(false)}
          />
        )}
      </AnimatePresence>

      {/* Stats principales */}

      <motion.div
        variants={containerVariants}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          titulo="Pedido"
          valor={pedidosSegunFiltro}
          descripcion={`${data?.pedidos.pendientes ?? 0} pendientes`}
          icon={<ShoppingCart className="size-5" />}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />

        <StatCard
          titulo="Ingresos"
          valor={formatCurrency(ingresosSegunFiltro)}
          descripcion="Ventas completadas"
          icon={<DollarSign className="size-5" />}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-600"
          trend={
            timeFilter === 'mes' && data
              ? {
                  value: Math.abs(data.ingresos.variacion),
                  isPositive: data.ingresos.tendencia === 'up',
                }
              : undefined
          }
          // Barra de meta solo visible en el filtro "mes"
          meta={
            timeFilter === 'mes'
              ? {
                  actual: data?.ingresos.esteMes ?? 0,
                  objetivo: META_MENSUAL_DEFAULT,
                }
              : undefined
          }
        />

        <StatCard
          titulo="Ingresos Este Mes"
          valor={formatCurrency(data?.ingresos.esteMes ?? 0)}
          descripcion="Acumulado del mes"
          icon={<TrendingUp className="size-5" />}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
          trend={
            data
              ? {
                  value: Math.abs(data.ingresos.variacion),
                  isPositive: data.ingresos.tendencia === 'up',
                }
              : undefined
          }
        />

        <StatCard
          titulo="Clientes"
          valor={data?.clientes.total ?? 0}
          descripcion={`+${data?.clientes.nuevosEsteMes ?? 0} nuevos este mes`}
          icon={<Users className="size-5" />}
          iconBg="bg-violet-500/10"
          iconColor="text-violet-600"
        />
      </motion.div>

      {/* mini stats */}

      <motion.div
        variants={containerVariants}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <MiniStatCard
          icon={<CheckCircle className="size-5" />}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-600"
          label="Completados"
          value={data?.pedidos.completadosTotal ?? 0}
          sublabel="Total histórico"
        />
        <MiniStatCard
          icon={<Clock className="size-5" />}
          iconBg="bg-orange-500/10"
          iconColor="text-orange-600"
          label="Pendientes"
          value={data?.pedidos.pendientes ?? 0}
          sublabel="Requieren atención"
        />
        <MiniStatCard
          icon={<DollarSign className="size-5" />}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
          label="Ticket Promedio"
          value={formatCurrency(ticketPromedio)}
          sublabel="Por pedido"
        />
        <MiniStatCard
          icon={<Package className="size-5" />}
          iconBg="bg-red-500/10"
          iconColor="text-red-600"
          label="Stock Bajo"
          value={data?.productosStockBajo?.length ?? 0}
          sublabel="Productos"
        />
      </motion.div>

      {/* Grafica y top Productos */}

      <motion.div
        variants={containerVariants}
        className="grid gap-6 lg:grid-cols-3"
      >
        <IngresosChart data={graficaFormateada} />
        <TopProductos productos={topProductos} />
      </motion.div>

      {/* Pedidos recientes - stock bajo */}

      <motion.div
        variants={containerVariants}
        className="grid gap-6 lg:grid-cols-3"
      >
        <PedidosRecientes pedidos={data?.pedidosRecientes ?? []} />
        <StockBajo productos={data?.productosStockBajo ?? []} />
      </motion.div>
    </motion.div>
  );
}
