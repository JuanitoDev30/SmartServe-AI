import { ProductType } from '@/features/productos/schemas/productSchema';
import { CartItem } from './cartItem';

export interface HistoryMessage {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'them';
  status: 'sent' | 'delivered' | 'read';
  productos?: ProductType[];
  cart?: CartItem[];
}
