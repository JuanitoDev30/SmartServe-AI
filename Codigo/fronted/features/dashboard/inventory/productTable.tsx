'use client';

import { cn } from '@/lib/utils';
import { Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ProductStatus,
  ProductType,
} from '@/features/productos/schemas/productSchema';

interface ProductTableProps {
  productsResponse: ProductType[];
  onEdit: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
}

const statusConfig: Record<
  ProductStatus,
  { label: string; className: string }
> = {
  active: {
    label: 'Activo',
    className: 'bg-success/10 text-success',
  },
  inactive: {
    label: 'Inactivo',
    className: 'bg-muted text-muted-foreground',
  },
  low_stock: {
    label: 'Stock bajo',
    className: 'bg-warning/10 text-warning-foreground',
  },
  out_of_stock: {
    label: 'Sin stock',
    className: 'bg-destructive/10 text-destructive',
  },
};

export function ProductTable({
  productsResponse,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                Producto
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                SLUG
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
                Categoria
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                Precio
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                Stock
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                Estado
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {productsResponse.map(product => {
              const status = statusConfig[product.status as ProductStatus] ?? {
                label: 'Sin estado',
                className: 'bg-muted text-muted-foreground',
              };
              return (
                <tr
                  key={product.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <Package className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate max-w-[200px]">
                          {product.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm font-mono text-muted-foreground">
                      {product.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-foreground">
                      {product.categoria?.nombre || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-foreground">
                      ${product.precio}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        product.stock === 0,
                        // ? 'text-destructive'
                        // : product.stock <= product.minStock
                        //   ? 'text-warning-foreground'
                        //   : 'text-foreground',
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex justify-center">
                      <span
                        className={cn(
                          'text-xs font-medium px-2.5 py-1 rounded-full',
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(product)}
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
