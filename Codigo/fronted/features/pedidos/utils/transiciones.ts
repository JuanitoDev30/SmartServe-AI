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
