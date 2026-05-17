export interface CreateProductDto {
  nombre: string;
  precio?: number;
  descripcion?: string;
  slug?: string;
  stock?: number;
  proveedor?: string;
}

