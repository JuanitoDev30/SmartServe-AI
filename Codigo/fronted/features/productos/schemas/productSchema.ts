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
export type ProductStatus =
  | 'active'
  | 'inactive'
  | 'low_stock'
  | 'out_of_stock';

export interface ProductFormData {
  nombre: string;
  descripcion?: string;
  slug: string;
  categoriaId: string;
  precio: number;
  //costPrice?: number;
  stock: number;
  proveedor?: string;
  //minStock: number;
  status: ProductStatus;
  //imageUrl?: string;
}
