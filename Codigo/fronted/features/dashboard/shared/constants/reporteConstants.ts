import { TrendingUp, Package, Users, BookOpen } from 'lucide-react';

// ─── TIPOS ───────────────────────────────────────────────────────────────────
export type TabReporte = 'ventas' | 'productos' | 'clientes' | 'contable';

export const tabs: {
  value: TabReporte;
  label: string;
  icon: typeof TrendingUp;
  description: string;
}[] = [
  {
    value: 'ventas',
    label: 'Ventas',
    icon: TrendingUp,
    description: 'Análisis de ventas y transacciones',
  },
  {
    value: 'productos',
    label: 'Productos',
    icon: Package,
    description: 'Rendimiento de productos',
  },
  {
    value: 'clientes',
    label: 'Clientes',
    icon: Users,
    description: 'Comportamiento de clientes',
  },
  {
    value: 'contable',
    label: 'Contable',
    icon: BookOpen,
    description: 'Declaración de IVA',
  },
];

export const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const metodoPagoColors: Record<string, { bg: string; text: string }> = {
  EFECTIVO: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  TARJETA: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  TRANSFERENCIA: { bg: 'bg-violet-500/10', text: 'text-violet-600' },
  PSE: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
};

export const stockColors = {
  critical: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/20',
  },
  warning: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
  },
  good: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-500/20',
  },
};

export const ivaColors: Record<number, { bg: string; text: string }> = {
  0: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  5: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  19: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getPrimerDiaMes() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

export function getHoy() {
  return new Date().toISOString().split('T')[0];
}

export function getStockStatus(stock: number) {
  if (stock <= 2) return stockColors.critical;
  if (stock <= 5) return stockColors.warning;
  return stockColors.good;
}

export function getIvaColor(ivaPercent: number) {
  return ivaColors[ivaPercent] ?? ivaColors[19];
}
