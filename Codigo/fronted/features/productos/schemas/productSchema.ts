import { ProductFormValues } from '@/lib/validations/product';

export type ProductStatus =
  | 'active'
  | 'inactive'
  | 'low_stock'
  | 'out_of_stock';

export interface ProductType {
  id: string;
  nombre: string;
  precio?: number;
  descripcion?: string;
  slug?: string;
  stock?: number;
  proveedor?: string;
  status: ProductStatus;
  categoria?: {
    id: string;
    nombre: string;
  };
}

export type ProductFormData = ProductFormValues;
