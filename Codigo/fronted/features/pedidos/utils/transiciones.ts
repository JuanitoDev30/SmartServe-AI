import { EstadoPedido } from '../schemas/orderSchema';

export const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: ['CONFIRMADO', 'CANCELADO'],
  CONFIRMADO: ['EN_PREPARACION', 'CANCELADO'],
  EN_PREPARACION: ['EN_CAMINO'],
  EN_CAMINO: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

export const getEstadosPermitidos = (
  estadoActual: EstadoPedido,
): EstadoPedido[] => {
  return TRANSICIONES_VALIDAS[estadoActual];
};

export const estadoPedidoColors: Record<string, string> = {
  PENDIENTE: 'bg-orange-500/10 text-orange-600',
  CONFIRMADO: 'bg-blue-500/10 text-blue-600',
  EN_PREPARACION: 'bg-blue-500/10 text-blue-600',
  EN_CAMINO: 'bg-cyan-500/10 text-cyan-600',
  ENTREGADO: 'bg-emerald-500/10 text-emerald-600',
  CANCELADO: 'bg-red-500/10 text-red-600',
};
