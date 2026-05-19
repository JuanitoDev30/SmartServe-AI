import { EstadoCliente } from '@/features/clientes/schemas/clientSchema';
import {
  ESTADOS_PEDIDO,
  type EstadoPedido,
} from '@/features/pedidos/schemas/orderSchema';

export const ESTADO_CLIENTE_CONFIG: Record<
  EstadoCliente,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  ACTIVO: { label: 'Activo', variant: 'default' },
  INACTIVO: { label: 'Inactivo', variant: 'secondary' },
};

export const ESTADO_PEDIDO_CONFIG: Record<
  EstadoPedido,
  { label: string; color: string }
> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-orange-500' },
  CONFIRMADO: { label: 'Confirmado', color: 'bg-blue-500' },
  EN_PREPARACION: { label: 'En Preparación', color: 'bg-blue-500' },
  EN_CAMINO: { label: 'En Camino', color: 'bg-cyan-500' },
  ENTREGADO: { label: 'Entregado', color: 'bg-emerald-500' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500' },
};

export const ESTADO_PEDIDO_FILTROS = [
  { label: 'Todos', value: 'todos' as const },
  ...ESTADOS_PEDIDO.map(value => ({
    label: ESTADO_PEDIDO_CONFIG[value].label,
    value,
  })),
];
