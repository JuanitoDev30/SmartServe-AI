'use client';

import { StatsCard } from './shared/statsCard';
import { formatCurrency } from '@/lib/formatCurrency';
import { ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Bienvenido al Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aquí puedes ver un resumen de tus datos y actividades recientes.
        </p>
      </div>

      {/* Stats Grid */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          titulo="Pedidos Hoy"
          valor="47"
          icon={ShoppingCart}
          tendencia={{ value: 12, isPositive: true }}
        />
        <StatsCard
          titulo="Ingresos Hoy"
          valor={formatCurrency(1850000)}
          icon={DollarSign}
          tendencia={{ value: 8, isPositive: true }}
        />
        <StatsCard
          titulo="Pendientes"
          valor="23"
          icon={Clock}
          descripcion="Requieren atencion"
        />
        <StatsCard
          titulo="Completados"
          valor="1,180"
          icon={CheckCircle}
          descripcion="Total historico"
        />
      </div>

      {/* Recent Orders */}
    </div>
  );
}
