'use client';

import { useState } from 'react';
import { toast } from '@/hooks/useToast';
import { CategoryTable } from './categoryTable';
import { CategoryFormModal } from './categoryForm';
import { DeleteConfirmModal } from './deleteConfirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FolderOpen } from 'lucide-react';

import { createCategoryAction } from '@/features/categories/actions/createCategoryActions';
import { updateCategoryAction } from '@/features/categories/actions/updateCategoryActions';
import { deleteCategoryAction } from '@/features/categories/actions/deleteCategoryActions';

import {
  CategoryType,
  CategoryFormData,
} from '@/features/categories/schemas/categorySchema';
import { ProductType } from '@/features/productos/schemas/productSchema';

interface CategoryDashboardProps {
  categoriesResponse: CategoryType[];
  productsResponse: ProductType[];
}

export function CategoryDashboard({
  categoriesResponse,
  productsResponse,
}: CategoryDashboardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );

  const filteredCategories = categoriesResponse.filter(category =>
    category.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
    setFormError(null);
  };

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    if (data.nombre.trim().length < 3) {
      toast({
        variant: 'destructive',
        title: 'Nombre inválido',
        description:
          'El nombre de la categoría debe tener al menos 3 caracteres',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let result: { success: boolean; error?: string } = { success: false };

      if (selectedCategory) {
        result = await updateCategoryAction(selectedCategory.id, data);

        if (!result.success) {
          setFormError(result.error ?? null);
          toast({
            variant: 'destructive',
            title: 'Error al actualizar la categoría',
            description: result.error || 'Ocurrió un error inesperado',
            duration: 3000,
          });
          return;
        }

        toast({
          variant: 'default',
          title: 'Categoría actualizada',
          description: 'La categoría se actualizó correctamente',
          duration: 3000,
        });
      } else {
        result = await createCategoryAction(data);

        if (!result.success) {
          setFormError(result.error ?? null);
          toast({
            variant: 'destructive',
            title: 'Error al crear la categoría',
            description: result.error || 'Ocurrió un error inesperado',
            duration: 3000,
          });
          return;
        }

        toast({
          variant: 'default',
          title: 'Categoría creada',
          description: 'La categoría se creó correctamente',
          duration: 3000,
        });
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory?.id) return;

    setIsSubmitting(true);

    try {
      const result = await deleteCategoryAction(selectedCategory.id);

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error al eliminar categoría',
          description: result.error || 'Ocurrió un error inesperado',
          duration: 3000,
        });
        return;
      }

      setIsDeleteOpen(false);
      setSelectedCategory(null);
      toast({
        variant: 'default',
        title: 'Categoría eliminada',
        description: 'La categoría se eliminó correctamente',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Categorías</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona las categorías de tus productos
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shrink-0">
          <Plus className="size-4" />
          Nueva categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderOpen className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {categoriesResponse.length}
              </p>
              <p className="text-xs text-muted-foreground">Total categorías</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar categorías..."
            className="pl-10 h-10"
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="size-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            No hay categorías
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {search
              ? 'No se encontraron categorías con ese nombre'
              : 'Comienza agregando tu primera categoría'}
          </p>
          {!search && (
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="size-4" />
              Agregar categoría
            </Button>
          )}
        </div>
      ) : (
        <CategoryTable
          categoriesResponse={filteredCategories}
          products={productsResponse}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setFormError(null);
        }}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
        isLoading={isSubmitting}
        error={formError}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        category={selectedCategory}
        isLoading={isSubmitting}
      />
    </div>
  );
}
