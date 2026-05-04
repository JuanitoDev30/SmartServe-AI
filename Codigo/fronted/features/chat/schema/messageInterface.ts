import { ProductType } from '@/features/productos/schemas/productSchema';
import { CartItem } from './cartItem';

export interface Message {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'them';
  status: 'sent' | 'delivered' | 'read';
  productos?: ProductType[];
  cart?: CartItem[];
  clienteInfo?: {
    nombre: string | null;
    telefono: string | null;
    direccion: string | null;
    metodoPago: string | null;
  };
  pedidoId?: string;
  estado?: string;
}
