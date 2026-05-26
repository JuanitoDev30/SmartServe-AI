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
  Truck,
  Receipt,
} from 'lucide-react';
import { useState, useMemo, useTransition } from 'react';
import { formatCurrency } from '@/lib/utils/formatters';

// Tus schemas originales — sin cambios
import type { Overview } from '../overView/schemas/overViewSchema';
import type {
  GraficaItem,
  PeriodoGrafica,
  PeriodoTopProductos,
  TopProducto,
} from '../ventas/schemas/ventasSchema';
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
import { getGraficaVentasAction } from '../ventas/actions/getGraficaVentasActions';
import { getTopProductosAction } from '../ventas/actions/getTopProductosVentasActions';

const GRAFICA_PERIODO: Record<TimeFilter, PeriodoGrafica> = {
  hoy: 'dia',
  semana: 'semana',
  mes: 'mes',
};

const TOP_PERIODO: Record<TimeFilter, PeriodoTopProductos> = {
  hoy: 'semana',
  semana: 'semana',
  mes: 'mes',
};

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
  const [grafica, setGrafica] = useState(initialGrafica ?? []);
  const [topProductos, setTopProductos] = useState(initialTopProductos ?? []);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('semana');
  const [showAlert, setShowAlert] = useState(true);
  const [isPending, startTransition] = useTransition();

  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  // Formateo de fechas con timezone Colombia explícito para evitar el bug de +1 día
  const graficaFormateada = useMemo(
    () =>
      grafica.map(g => ({
        ...g,
        label: new Intl.DateTimeFormat('es-CO', {
          day: '2-digit',
          month: 'short',
          timeZone: 'America/Bogota',
        }).format(new Date(g.label)),
        total: Number(g.total),
      })),
    [grafica],
  );

  // Cuando cambia el filtro: actualiza gráfica y top productos desde el servidor
  function handleFilterChange(filter: TimeFilter) {
    setTimeFilter(filter);
    startTransition(async () => {
      const [graficaRes, topRes] = await Promise.all([
        getGraficaVentasAction(GRAFICA_PERIODO[filter]),
        getTopProductosAction(5, TOP_PERIODO[filter]),
      ]);
      if (graficaRes.success && graficaRes.data) setGrafica(graficaRes.data);
      if (topRes.success && topRes.data) setTopProductos(topRes.data);
    });
  }

  // Valores exactos del backend según filtro — sin aproximaciones
  const ingresosSegunFiltro =
    timeFilter === 'hoy'
      ? (data?.ingresos.hoy ?? 0)
      : timeFilter === 'semana'
        ? (data?.ingresos.estaSemana ?? 0)
        : (data?.ingresos.esteMes ?? 0);

  const pedidosSegunFiltro =
    timeFilter === 'hoy'
      ? (data?.pedidos.hoy ?? 0)
      : timeFilter === 'semana'
        ? (data?.pedidos.semana ?? 0)
        : (data?.pedidos.mes ?? 0);

  // Alertas
  const pedidosUrgentes = useMemo(
    () =>
      (data?.pedidosRecientes ?? []).filter(
        (p: any) => p.estado === 'PENDIENTE',
      ),
    [data?.pedidosRecientes],
  );
  const stockCritico = useMemo(
    () => (data?.productosStockBajo ?? []).filter(p => p.stock <= 2),
    [data?.productosStockBajo],
  );

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
            Aquí tienes un resumen de tu negocio ·{' '}
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              timeZone: 'America/Bogota',
            })}
          </p>
        </div>
        <TimeFilterTabs
          activeFilter={timeFilter}
          onFilterChange={handleFilterChange}
          isPending={isPending}
        />
      </motion.div>

      {/* Alertas */}
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
          titulo="Pedidos"
          valor={pedidosSegunFiltro}
          descripcion={`${data?.pedidos.pendientes ?? 0} pendientes · ${data?.pedidos.enCamino ?? 0} en camino`}
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
        />
        <StatCard
          titulo="Ticket Promedio"
          valor={formatCurrency(data?.ticketPromedio ?? 0)}
          descripcion="Por pedido este mes"
          icon={<Receipt className="size-5" />}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
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

      {/* Mini stats */}
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
          icon={<Truck className="size-5" />}
          iconBg="bg-cyan-500/10"
          iconColor="text-cyan-600"
          label="En Camino"
          value={data?.pedidos.enCamino ?? 0}
          sublabel="En ruta ahora"
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

      {/* Gráfica + Top Productos — se actualizan con el filtro */}
      <motion.div
        variants={containerVariants}
        className={`grid gap-6 lg:grid-cols-3 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}
      >
        <IngresosChart data={graficaFormateada} />
        <TopProductos productos={topProductos} />
      </motion.div>

      {/* Pedidos Recientes + Stock Bajo */}
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
