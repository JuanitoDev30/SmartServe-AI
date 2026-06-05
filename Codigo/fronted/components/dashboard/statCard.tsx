'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { itemVariants } from '@/features/dashboard/shared/constants/timeFilterLabels';

interface StatCardProps {
  titulo: string;
  valor: string | number;
  descripcion?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  meta?: {
    actual: number;
    objetivo: number;
  };
}

export function StatCard({
  titulo,
  valor,
  descripcion,
  icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  trend,
  meta,
}: StatCardProps) {
  const porcentajeMeta = meta
    ? Math.min((meta.actual / meta.objetivo) * 100, 100)
    : 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Gradiente decorativo en hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {valor}
          </p>
          {descripcion && (
            <p className="text-xs text-muted-foreground">{descripcion}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 pt-1">
              {trend.isPositive ? (
                <TrendingUp className="size-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="size-3.5 text-red-500" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-emerald-600' : 'text-red-600',
                )}
              >
                {trend.value}% vs mes anterior
              </span>
            </div>
          )}
        </div>

        <motion.div
          whileHover={{ rotate: 6, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={cn('rounded-xl p-3 transition-transform', iconBg)}
        >
          {icon}
        </motion.div>
      </div>

      {/* Barra de progreso para metas */}
      {meta && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Meta mensual</span>
            <span className="font-medium text-foreground">
              {porcentajeMeta.toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentajeMeta}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className={cn(
                'h-full rounded-full',
                porcentajeMeta >= 100
                  ? 'bg-emerald-500'
                  : porcentajeMeta >= 75
                    ? 'bg-primary'
                    : porcentajeMeta >= 50
                      ? 'bg-amber-500'
                      : 'bg-red-500',
              )}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
