'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Package } from 'lucide-react';
import type { StockPorCategoria } from '@/features/overView/schemas/types';

interface StockChartProps {
  data: StockPorCategoria[];
}

const CHART_COLORS = [
  'var(--color-chart-1)', // esmeralda (primary)
  'var(--color-chart-2)', // azul
  'var(--color-chart-3)', // índigo
  'var(--color-chart-4)', // verde lima
  'var(--color-chart-5)', // naranja
];

function getColor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d: StockPorCategoria = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-popover px-4 py-3 shadow-lg text-sm min-w-[160px]">
      <p className="font-semibold text-popover-foreground mb-2">{label}</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Unidades</span>
          <span className="font-semibold text-foreground">{d.totalStock}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Productos</span>
          <span className="font-semibold text-foreground">
            {d.totalProductos}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
      <div className="rounded-full bg-muted p-3">
        <Package className="size-5" />
      </div>
      <p className="text-sm">Sin datos de stock disponibles</p>
    </div>
  );
}

export function StockChart({ data }: StockChartProps) {
  const totalUnidades = data.reduce((acc, d) => acc + d.totalStock, 0);
  const totalProductos = data.reduce((acc, d) => acc + d.totalProductos, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">
            Stock disponible por categoría
          </p>
          <p className="text-xs text-muted-foreground">
            Unidades en inventario · {data.length} categorías
          </p>
        </div>

        {/* Totales resumen */}
        <div className="flex gap-4 sm:gap-6 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-foreground tabular-nums">
              {totalUnidades.toLocaleString('es-CO')}
            </span>
            <span className="text-xs text-muted-foreground">
              unidades totales
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-foreground tabular-nums">
              {totalProductos}
            </span>
            <span className="text-xs text-muted-foreground">productos</span>
          </div>
        </div>
      </div>

      {/* Leyenda de colores */}
      {data.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {data.map((item, i) => (
            <span
              key={item.categoria}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className="inline-block size-2 rounded-full shrink-0"
                style={{ background: getColor(i) }}
              />
              {item.categoria}
            </span>
          ))}
        </div>
      )}

      {/* Gráfica o empty state */}
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barCategoryGap="35%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="categoria"
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'var(--color-muted)', opacity: 0.5 }}
            />
            <Bar dataKey="totalStock" radius={[6, 6, 0, 0]} maxBarSize={72}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Ranking de categorías por stock */}
      {data.length > 0 && (
        <div className="flex flex-col gap-2 pt-4 border-t border-border ">
          {data.map((item, i) => {
            const porcentaje =
              totalUnidades > 0
                ? Math.round((item.totalStock / totalUnidades) * 100)
                : 0;
            return (
              <div key={item.categoria} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4 tabular-nums">
                  {i + 1}
                </span>
                <span className="text-xs text-foreground flex-1 truncate">
                  {item.categoria}
                </span>
                {/* Barra de progreso */}
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${porcentaje}%`,
                      background: getColor(i),
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground tabular-nums w-8 text-right">
                  {porcentaje}%
                </span>
                <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">
                  {item.totalStock.toLocaleString('es-CO')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
