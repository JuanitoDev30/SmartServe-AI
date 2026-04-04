'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  titulo: string;
  valor: string;
  descripcion?: string;
  icon: LucideIcon;
  tendencia?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  titulo,
  valor,
  descripcion,
  icon: Icon,
  tendencia,
}: StatsCardProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{valor}</p>
          {descripcion && (
            <p className="text-sm text-muted-foreground mt-1">{descripcion}</p>
          )}
          {tendencia && (
            <p
              className={cn(
                'text-sm font-medium mt-2',
                tendencia.isPositive ? 'text-emerald-600' : 'text-red-600',
              )}
            >
              {tendencia.isPositive ? '+' : '-'}
              {Math.abs(tendencia.value)}% vs ayer
            </p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
