import { CartItem } from './cartItem';
import { CitaAgendada } from './citaAgendada';
import { ImagenMensaje } from './imagenMensaje';

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
  /** Cita registrada en este turno; se dibuja como tarjeta bajo el texto. */
  cita?: CitaAgendada;
  /** Fotos del turno; se dibujan dentro de la burbuja, sobre el texto. */
  imagenes?: ImagenMensaje[];
}
