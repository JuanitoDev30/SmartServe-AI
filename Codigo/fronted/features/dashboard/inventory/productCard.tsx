'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropDownMenu';
import {
  ProductStatus,
  ProductType,
} from '@/features/users/schemas/productSchema';
import { cn } from '@/lib/utils';

import { Edit2, MoreVertical, Package, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: ProductType;
  onEdit: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
}

const statusConfig: Record<ProductStatus, { label: string; color: string }> = {
  active: {
    label: 'Activo',
    color: 'bg-success/10 text-success',
  },
  inactive: {
    label: 'Inactivo',
    color: 'bg-muted text-muted-foreground',
  },
  low_stock: {
    label: 'Stock bajo',
    color: 'bg-warning/10 text-warning-foreground',
  },
  out_of_stock: {
    label: 'Sin stock',
    color: 'bg-destructive/10 text-destructive',
  },
};

const categoryLabels: Record<string, string> = {
  bebidas: 'Bebidas',
  snacks: 'Snacks',
  cuidado_personal: 'Cuidado Personal',
  otros: 'Otros',
};

export function ProductCard({ onDelete, onEdit, product }: ProductCardProps) {
  const status = statusConfig[product.status];

  return (
    <div className="group relative bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Package className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {product.nombre}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {product.slug}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit2 className="size-4 mr-2" />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(product)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Description */}
      {product.descripcion && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.descripcion}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-xs text-muted-foreground mb-0.5">Precio</p>
          <p className="text-sm font-semibold text-foreground">
            ${product.precio}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-xs text-muted-foreground mb-0.5">Stock</p>
          <p className="text-sm font-semibold text-foreground">
            {product.stock} uds
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/50">
          {categoryLabels[product.categoria]}
        </span>
        <span
          className={cn(
            'text-xs font-medium px-2.5 py-1 rounded-full',
            //  status.color,
          )}
        >
          {/* {status.label} */}
        </span>
      </div>
    </div>
  );
}
