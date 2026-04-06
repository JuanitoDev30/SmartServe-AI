export interface ProductType {
  id: string;
  nombre: string;
  precio?: number;
  descripcion?: string;
  slug?: string;
  stock?: number;
  proveedor?: string;
  status: ProductStatus;
  categoria: ProductCategory;
}

export type ProductStatus =
  | 'active'
  | 'inactive'
  | 'low_stock'
  | 'out_of_stock';

export type ProductCategory =
  | 'food'
  | 'beverages'
  | 'electronics'
  | 'clothing'
  | 'other';

export interface ProductFormData {
  nombre: string;
  descripcion?: string;
  slug: string;
  categoria: ProductCategory;
  precio: number;
  //costPrice?: number;
  stock: number;
  proveedor?: string;
  //minStock: number;
  status: ProductStatus;
  //imageUrl?: string;
}
