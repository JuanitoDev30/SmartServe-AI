import { CartItem } from './cartItem';
import { CitaAgendada } from './citaAgendada';
import { ImagenMensaje } from './imagenMensaje';

export interface ChatResponse {
  message: string;
  contactId: string;
  cart: CartItem[];
  cartTotal: number;
  pedidoId?: string;
  /** La cita que el agente acaba de registrar en este turno. */
  cita?: CitaAgendada;
  /** Fotos que el agente adjunto a esta respuesta. */
  imagenes?: ImagenMensaje[];
  /** Datos del cliente que al agente todavia le faltan para cerrar el pedido. */
  faltantes: string[];
}
