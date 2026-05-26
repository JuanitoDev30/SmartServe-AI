import { itemVariants } from '@/features/dashboard/shared/constants/timeFilterLabels';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';

export interface StatCardProps {
  titulo: string;
  valor: string | number;
  descripcion?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: { value: number; isPositive: boolean };
  /** Muestra barra de progreso hacia una meta (solo en filtro "mes") */
  meta?: { actual: number; objetivo: number };
}

export function StatCard({
  titulo,
  valor,
  descripcion,
  icon,
  iconBg,
  iconColor,
  trend,
  meta,
}: StatCardProps) {
  const porcentajeMeta = meta
    ? Math.min((meta.actual / meta.objetivo) * 100, 100)
    : null;

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-border bg-card p-5 space-y-3 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-sm text-muted-foreground font-medium">{titulo}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {valor}
          </p>
          {descripcion && (
            <p className="text-xs text-muted-foreground">{descripcion}</p>
          )}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.isPositive ? 'text-emerald-600' : 'text-red-500',
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
        <div className={cn('rounded-xl p-3', iconBg)}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>

      {/* Barra de progreso de meta mensual */}
      {meta && porcentajeMeta !== null && (
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Meta mensual</span>
            <span className="font-semibold text-foreground">
              {porcentajeMeta.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={cn(
                'h-full rounded-full',
                porcentajeMeta >= 100
                  ? 'bg-emerald-500'
                  : porcentajeMeta >= 75
                    ? 'bg-blue-500'
                    : porcentajeMeta >= 50
                      ? 'bg-orange-500'
                      : 'bg-red-500',
              )}
              initial={{ width: 0 }}
              animate={{ width: `${porcentajeMeta}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(meta.actual)} de {formatCurrency(meta.objetivo)}
          </p>
        </div>
      )}
    </motion.div>
  );
}
