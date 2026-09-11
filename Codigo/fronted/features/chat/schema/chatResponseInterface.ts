import { CartItem } from './cartItem';

export interface ChatResponse {
  message: string;
  contactId: string;
  cart: CartItem[];
  cartTotal: number;
  pedidoId?: string;
  /** Datos del cliente que al agente todavia le faltan para cerrar el pedido. */
  faltantes: string[];
}
