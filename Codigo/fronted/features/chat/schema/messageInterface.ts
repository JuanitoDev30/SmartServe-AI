import { CartItem } from './cartItem';

export interface Message {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'them';
  status: 'sent' | 'delivered' | 'read';
  /** Borrador del pedido tal como quedo despues de este turno del agente. */
  cart?: CartItem[];
  /** Id del pedido ya escrito en el ERP, cuando el cliente confirmo. */
  pedidoId?: string;
}
