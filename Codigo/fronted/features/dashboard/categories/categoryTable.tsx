'use client';

import { Edit2, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/features/categories/schemas/categorySchema';

interface CategoryTableProps {
  categoriesResponse: CategoryType[];
  onEdit: (category: CategoryType) => void;
  onDelete: (category: CategoryType) => void;
}

export function CategoryTable({
  categoriesResponse,
  onEdit,
  onDelete,
}: CategoryTableProps) {
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
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categoriesResponse.map((category) => (
              <tr
                key={category.id}
                className="group hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <FolderOpen className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate max-w-[200px]">
                        {category.nombre}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {category.descripcion || 'Sin descripción'}
                  </span>
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