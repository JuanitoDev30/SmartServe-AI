import { ProductType } from '@/features/productos/schemas/productSchema';
import { CartItem } from './cartItem';

export interface ChatResponse {
  message: string;
  contactId: string;
  productos?: ProductType[];
  cart?: CartItem[];
  clienteInfo?: {
    nombre: string | null;
    telefono: string | null;
    direccion: string | null;
    metodoPago: string | null;
  };
}
