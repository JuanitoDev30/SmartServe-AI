import { itemVariants } from '@/features/dashboard/shared/constants/timeFilterLabels';
import { GraficaItem } from '@/features/ventas/schemas/ventasSchema';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CustomTooltip } from './customToolTip';

interface IngresosChartProps {
  data: GraficaItem[];
}

export function IngresosChart({ data }: IngresosChartProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">
          Ingresos Última Semana
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ventas completadas últimos 7 días
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
          No hay datos de ventas para esta semana
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
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
    </motion.div>
  );
}
