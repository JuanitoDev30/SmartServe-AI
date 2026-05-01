import { ProductType } from '@/features/productos/schemas/productSchema';
import { CartItem } from './cartItem';

export interface ChatResponse {
  message: string;
  contactId: string;
  productos?: ProductType[];
  cart?: CartItem[];
}
