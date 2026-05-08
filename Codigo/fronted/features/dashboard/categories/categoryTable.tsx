'use client';

import { Edit2, Trash2, FolderOpen, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/features/categories/schemas/categorySchema';
import { ProductType } from '@/features/productos/schemas/productSchema';
import { useState } from 'react';

interface CategoryTableProps {
  categoriesResponse: CategoryType[];
  products?: ProductType[];
  onEdit: (category: CategoryType) => void;
  onDelete: (category: CategoryType) => void;
}
function ProductsBadge({ products }: { products: ProductType[] }) {
  const [open, setOpen] = useState(false);
  const count = products.length;

  if (count === 0) {
    return (
      <span className="text-xs text-muted-foreground italic">
        Sin productos
      </span>
    );
  }

  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <Package className="size-3" />
        {count} {count === 1 ? 'producto' : 'productos'}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-48 rounded-lg border border-border bg-popover shadow-lg py-1.5">
          {/* Flecha */}
          <div className="absolute -top-1.5 left-4 size-3 rotate-45 border-l border-t border-border bg-popover" />

          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Productos
          </p>
          <ul className="max-h-40 overflow-y-auto">
            {products.map(product => (
              <li
                key={product.id}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 transition-colors"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-primary/60" />
                <span className="text-xs text-foreground truncate">
                  {product.nombre}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function CategoryTable({
  categoriesResponse,
  products = [],
  onEdit,
  onDelete,
}: CategoryTableProps) {
  // Agrupa productos por categoriaId una sola vez — O(n) en lugar de
  // filtrar dentro de cada fila en cada render
  const productsByCategory = products.reduce<Record<string, ProductType[]>>(
    (acc, product) => {
      const catId = product.categoria?.id;
      if (!catId) return acc;
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(product);
      return acc;
    },
    {},
  );

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                Categoría
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
                Descripción
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                Productos
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categoriesResponse.map(category => (
              <tr
                key={category.id}
                className="group hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <FolderOpen className="size-4" />
                    </div>
                    <p className="font-medium text-sm text-foreground truncate max-w-[200px]">
                      {category.nombre}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {category.descripcion || 'Sin descripción'}
                  </span>
                </td>

                <td className="px-4 py-3 hidden sm:table-cell">
                  <ProductsBadge
                    products={productsByCategory[category.id] ?? []}
                  />
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(category)}
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
