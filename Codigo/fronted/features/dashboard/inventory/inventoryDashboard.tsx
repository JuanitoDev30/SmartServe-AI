'use client';

import { useState } from 'react';
import { toast } from '@/hooks/useToast';
import { useMemo } from 'react';
import { ProductCard } from './productCard';
import { ProductTable } from './productTable';
import { ProductFormModal } from './productForm';
import { DeleteConfirmModal } from './deleteConfirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Package,
  AlertCircle,
  PackageX,
  DollarSign,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { createProductActions } from '@/features/productos/actions/createProductActions';
import { updateProductActions } from '@/features/productos/actions/updateProductActions';
import { deleteProductActions } from '@/features/productos/actions/deleteProductActions';

import {
  ProductCategory,
  ProductFormData,
  ProductStatus,
  ProductType,
} from '@/features/productos/schemas/productSchema';
import useInventoryFormHandler from './hooks/useInventoryFormHandler';
import Link from 'next/link';
import { CategoryType } from '@/features/categories/schemas/categorySchema';

type ViewMode = 'grid' | 'table';

interface Stats {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

interface InventoryDashboardProps {
  productsResponse: ProductType[];
  categoriesResponse?: CategoryType[];
}

export function InventoryDashboard({
  productsResponse,
  categoriesResponse,
}: InventoryDashboardProps) {
  const [products, setProducts] = useState<ProductType[]>(productsResponse);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [status, setStatus] = useState<ProductStatus | ''>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const { refresh } = useInventoryFormHandler({ isEdit: !!selectedProduct });

  const stats = useMemo<Stats>(() => {
    return {
      total: productsResponse.length,
      active: productsResponse.filter(p => p.stock && p.stock > 0).length,
      lowStock: productsResponse.filter(
        p => p.stock && p.stock > 0 && p.stock < 5,
      ).length,
      outOfStock: productsResponse.filter(p => !p.stock || p.stock === 0)
        .length,
      totalValue: productsResponse.reduce(
        (acc, p) => acc + (p.precio && p.stock ? p.precio * p.stock : 0),
        0,
      ),
    };
  }, [productsResponse]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
    setFormError(null);
  };

  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    if (data.nombre.trim().length < 3) {
      toast({
        variant: 'destructive',
        title: 'Nombre inválido',
        description: 'El nombre del producto debe tener al menos 3 caracteres',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // if (!selectedProduct?.id) return; // para evitar errores de tipo, aunque en teoría no debería pasar
      let result: { success: boolean; error?: string } = { success: false };
      if (selectedProduct) {
        const cleanData: ProductFormData = {
          ...data,
          precio: Number(data.precio),
          status: data.status || undefined,
          categoriaId: data.categoriaId || '',
        };

        //console.log('DATA ENVIADA:', data);
        result = await updateProductActions(selectedProduct.id, cleanData);

        if (!result.success) {
          console.log('Error al actualizar', result.error);
          setFormError(result.error ?? null);
          console.log('---->', result.success);

          return;
        }

        toast({
          variant: result.success ? 'default' : 'destructive',
          title: result.success
            ? 'Producto actualizado'
            : 'Error al actualizar el producto',
          description: result.success
            ? 'El producto se actualizó correctamente'
            : result.error || 'Ocurrió un error inesperado',

          duration: 3000,
        });
      } else {
        const cleanData: ProductFormData = {
          ...data,
          precio: Number(data.precio),
          status: data.status || undefined,
          categoriaId: data.categoriaId || '',
        };

        result = await createProductActions(cleanData);
        console.log('RESULT:', result); // 👈 ¿qué llega aquí?

        if (!result.success) {
          setFormError(result.error ?? null);

          toast({
            variant: 'destructive',
            title: 'Error al crear producto',
            description: result.error || 'Ocurrió un error inesperado',
            duration: 3000,
          });

          return;
        }

        toast({
          variant: 'default',
          title: 'Producto creado',
          description: 'El producto se creó correctamente',
          duration: 3000,
        });
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct?.id) return;

    setIsSubmitting(true);

    try {
      const result = await deleteProductActions(selectedProduct.id);

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error al eliminar producto',
          description: result.error || 'Ocurrió un error inesperado',
          duration: 3000,
        });
        return;
      }

      setIsDeleteOpen(false);
      setSelectedProduct(null);
      toast({
        variant: 'default',
        title: 'Producto eliminado',
        description: 'El producto se eliminó correctamente',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inventario</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tus productos y controla el stock
          </p>
        </div>
        <div>
          <Button onClick={handleCreate} className="gap-2 shrink-0">
            <Plus className="size-4" />
            Nuevo producto
          </Button>

          <Link href="/dashboard/categorias" className="ml-2">
            <Button className="gap-2 ml-2 shrink-0" variant="outline">
              <Plus className="size-4" />
              Nueva categoria
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.total}
                </p>
                <p className="text-xs text-muted-foreground">Total productos</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                <AlertCircle className="size-5 text-warning-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.lowStock}
                </p>
                <p className="text-xs text-muted-foreground">Stock bajo</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                <PackageX className="size-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.outOfStock}
                </p>
                <p className="text-xs text-muted-foreground">Sin stock</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-success/10">
                <DollarSign className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  ${stats.totalValue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Valor inventario
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="pl-10 h-10"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as ProductCategory | '')}
          className="h-10 rounded-lg border border-input bg-input px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[140px]"
        >
          {categoriesResponse?.map(cat => (
            <option key={cat.id} value={cat.nombre}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as ProductStatus | '')}
          className="h-10 rounded-lg border border-input bg-input px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[130px]"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="low_stock">Stock bajo</option>
          <option value="out_of_stock">Sin stock</option>
        </select>
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-muted/30">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'rounded-md p-2 transition-colors',
              viewMode === 'grid'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'rounded-md p-2 transition-colors',
              viewMode === 'table'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="size-4" />
          </button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refresh}
          disabled={isLoading}
          className="size-10 shrink-0"
        >
          <RefreshCw className={cn('size-4', isLoading && 'animate-spin')} />
        </Button>
      </div>

      {/* Products */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : productsResponse.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="size-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            No hay productos
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {search || category || status
              ? 'No se encontraron productos con esos filtros'
              : 'Comienza agregando tu primer producto'}
          </p>
          {!search && !category && !status && (
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="size-4" />
              Agregar producto
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productsResponse.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          productsResponse={productsResponse}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setFormError(null);
        }}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        isLoading={isSubmitting}
        error={formError}
        categories={categoriesResponse}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        product={selectedProduct}
        isLoading={isSubmitting}
      />
    </div>
  );
}
