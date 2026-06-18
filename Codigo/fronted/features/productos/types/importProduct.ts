import { ProductType } from '../schemas/productSchema';

export interface RowError {
  fila: number;
  nombre: string;
  errores: string[];
}

export interface ImportProductsResponse {
  success: number;
  errors: RowError[];
  created: ProductType[];
}
