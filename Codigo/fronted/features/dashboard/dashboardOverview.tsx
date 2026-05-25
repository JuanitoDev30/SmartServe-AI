'use client';

import { formatCurrency, formatDate } from '@/lib/utils/formatters';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Users,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { Overview } from '../overView/schemas/overViewSchema';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { GraficaItem, TopProducto } from '../ventas/schemas/ventasSchema';

interface DashboardOverviewProps {
  initialData: Overview | null;
  initialGrafica: GraficaItem[] | null;
  initialTopProductos: TopProducto[] | null;
  userName: string | null;
}

const estadoConfig: Record<string, { label: string; color: string }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-orange-500' },
  CONFIRMADO: { label: 'Confirmado', color: 'bg-blue-500' },
  EN_PREPARACION: { label: 'En Preparación', color: 'bg-blue-500' },
  EN_CAMINO: { label: 'En Camino', color: 'bg-cyan-500' },
  ENTREGADO: { label: 'Entregado', color: 'bg-emerald-500' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500' },
};

interface StatCardProps {
  titulo: string;
  valor: string | number;
  descripcion?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: number; isPositive: boolean };
}

function StatCard({
  titulo,
  valor,
  descripcion,
  icon,
  iconBg,
  trend,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className="text-2xl font-bold text-foreground">{valor}</p>
          {descripcion && (
            <p className="text-xs text-muted-foreground">{descripcion}</p>
          )}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.isPositive ? 'text-emerald-500' : 'text-red-500',
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {trend.isPositive ? '+' : ''}
              {trend.value}% vs mes anterior
            </div>
          )}
        </div>
        <div className={cn('rounded-full p-3', iconBg)}>{icon}</div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-foreground">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
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

  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  const graficaFormateada = grafica.map(g => ({
    ...g,
    label: new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
    }).format(new Date(g.label)),
    total: Number(g.total),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {saludo}, {userName ?? 'Administrador'} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aquí tienes un resumen de tu negocio hoy.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          titulo="Pedidos Hoy"
          valor={data?.pedidos.hoy ?? 0}
          descripcion={`${data?.pedidos.pendientes ?? 0} pendientes`}
          icon={<ShoppingCart className="size-5 text-white" />}
          iconBg="bg-primary"
        />
        <StatCard
          titulo="Ingresos Hoy"
          valor={formatCurrency(data?.ingresos.hoy ?? 0)}
          descripcion="Ventas completadas"
          icon={<DollarSign className="size-5 text-white" />}
          iconBg="bg-emerald-500"
        />
        <StatCard
          titulo="Ingresos Este Mes"
          valor={formatCurrency(data?.ingresos.esteMes ?? 0)}
          icon={<TrendingUp className="size-5 text-white" />}
          iconBg="bg-blue-500"
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
          icon={<Users className="size-5 text-white" />}
          iconBg="bg-orange-500"
        />
      </div>

      {/* Gráfica + Top Productos */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Grafica de ingresos semana */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground">
              Ingresos Última Semana
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ventas completadas últimos 7 días
            </p>
          </div>

          {graficaFormateada.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No hay datos de ventas para esta semana
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={graficaFormateada}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorIngresosOverview"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorIngresosOverview)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top productos */}

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Top Productos
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Este mes</p>
            </div>
          </div>

          {topProductos.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No hay datos de productos para este mes
            </div>
          ) : (
            <div className="space-y-4">
              {topProductos.map((producto, index) => {
                const maxIngresos = topProductos[0]?.ingresos ?? 1; // Para evitar división por cero
                const porcentaje =
                  maxIngresos > 0 ? (producto.ingresos / maxIngresos) * 100 : 0;
                return (
                  <div key={producto.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="size-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-foreground truncate max-w-[120px]">
                          {producto.nombre}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {producto.cantidadTotal} uds
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-foreground text-right">
                      {formatCurrency(producto.ingresos)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pedidos Recientes + Stock Bajo */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pedidos Recientes */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Pedidos Recientes
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Últimos 5 pedidos
              </p>
            </div>
            <Link
              href="/dashboard/pedido"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Ver todos <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {(data?.pedidosRecientes ?? []).length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No hay pedidos recientes
              </div>
            ) : (
              (data?.pedidosRecientes ?? []).map((pedido: any) => {
                const config = estadoConfig[pedido.estado] ?? {
                  label: pedido.estado,
                  color: 'bg-gray-500',
                };
                return (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                        {pedido.cliente?.nombre
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {pedido.cliente?.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pedido.items?.length} producto
                          {pedido.items?.length !== 1 ? 's' : ''} ·{' '}
                          {formatDate(pedido.creadoEn)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white',
                          config.color,
                        )}
                      >
                        {config.label}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(Number(pedido.total))}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Stock Bajo + Stats adicionales */}
        <div className="space-y-4">
          {/* Pedidos completados */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="size-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-foreground">
                  {data?.pedidos.completadosTotal ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Total histórico</p>
              </div>
            </div>
          </div>

          {/* Pedidos pendientes */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Clock className="size-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">
                  {data?.pedidos.pendientes ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  Requieren atención
                </p>
              </div>
            </div>
          </div>

          {/* Stock bajo */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  Stock Bajo
                </h3>
              </div>
              <Link
                href="/dashboard/productos"
                className="text-xs text-primary hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <div className="divide-y divide-border">
              {(data?.productosStockBajo ?? []).length === 0 ? (
                <div className="px-4 py-4 text-xs text-muted-foreground text-center">
                  Todos los productos tienen stock suficiente
                </div>
              ) : (
                (data?.productosStockBajo ?? []).map((producto: any) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground truncate max-w-[120px]">
                        {producto.nombre}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        producto.stock <= 2
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-orange-500/10 text-orange-500',
                      )}
                    >
                      {producto.stock} uds
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
