export type { Overview } from '../schemas/overViewSchema';
export type {
  GraficaItem,
  TopProducto,
} from '../../ventas/schemas/ventasSchema';

// Tipos propios del componente
export type TimeFilter = 'hoy' | 'semana' | 'mes';

export interface DashboardOverviewProps {
  initialData: import('../schemas/overViewSchema').Overview | null;
  initialGrafica:
    | import('../../ventas/schemas/ventasSchema').GraficaItem[]
    | null;
  initialTopProductos:
    | import('../../ventas/schemas/ventasSchema').TopProducto[]
    | null;
  userName: string | null;
}

export interface PedidoReciente {
  id: string;
  cliente: { nombre: string };
  items: unknown[];
  creadoEn: string;
  estado: string;
  total: string | number;
}

export interface ProductoStockBajo {
  id: string;
  nombre: string;
  stock: number;
}
