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
  /** URL de la imagen del producto; la sirve el API o es externa. */
  imagen?: string | null;
  status: ProductStatus;
  ivaPercent?: number;
  categoria?: {
    id: string;
    nombre: string;
  };
}

export type ProductFormData = ProductFormValues;
