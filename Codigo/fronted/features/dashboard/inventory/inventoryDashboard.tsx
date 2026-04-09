'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/useToast';

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

import { getProductsAction } from '@/features/products/actions/getProductActions';
import { createProductActions } from '@/features/products/actions/createProductActions';
import { updateProductActions } from '@/features/products/actions/updateProductActions';
import { deleteProductActions } from '@/features/products/actions/deleteProductActions';

import {
  ProductCategory,
  ProductFormData,
  ProductStatus,
  ProductType,
} from '@/features/products/schemas/productSchema';
import useInventoryFormHandler from './hooks/useInventoryFormHandler';

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
}

export function InventoryDashboard({
  productsResponse,
}: InventoryDashboardProps) {
  const [products, setProducts] = useState<ProductType[]>(productsResponse);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(productsResponse.length === 0);
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

  // const loadData = useCallback(async () => {
  //   setIsLoading(true);

  //   try {
  //     //const products = await getProductsAction();

  //     setProducts(products);

  //     const statsCalculated = {
  //       total: products.length,
  //       active: products.filter(p => p.stock > 0).length,
  //       lowStock: products.filter(p => p.stock > 0 && p.stock < 5).length,
  //       outOfStock: products.filter(p => p.stock === 0).length,
  //       totalValue: products.reduce((acc, p) => acc + p.precio * p.stock, 0),
  //     };

  //     setStats(statsCalculated);
  //   } catch (error) {
  //     console.error('Error al cargar los productos', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   loadData();
  // }, [loadData]);

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
          categoria: data.categoria || undefined,
        };

        //console.log('DATA ENVIADA:', data);
        result = await updateProductActions(selectedProduct.id, cleanData);

        if (!result.success) {
          console.log('Error al actualizar', result.error);
          setFormError(result.error ?? null);
          toast({
            variant: result.success ? 'default' : 'destructive',
            title: result.success
              ? 'Producto actualizad'
              : 'Error al actualizar el producto',
            description: result.success
              ? 'El producto se actualizó correctamente'
              : result.error || 'Ocurrió un error inesperado',
          });
          return;
        }
      } else {
        //console.log('CREAR');
        // result = await createProductActions(data);
        //console.log(result);

        toast({
          variant: result.success ? 'default' : 'destructive',
          title: result.success ? 'Producto creado' : 'Error al crear producto',
          description: result.success
            ? 'El producto se creó correctamente'
            : result.error || 'Ocurrió un error inesperado',
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
        });
        return;
      }

      setIsDeleteOpen(false);
      setSelectedProduct(null);
      toast({
        title: 'Producto eliminado',
        description: 'El producto se eliminó correctamente',
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
        <Button onClick={handleCreate} className="gap-2 shrink-0">
          <Plus className="size-4" />
          Nuevo producto
        </Button>
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
          <option value="">Todas las categorias</option>
          <option value="Aguardiente">Aguardiente</option>
          <option value="Cerveza">Cerveza</option>
          <option value="Snacks">Snacks</option>
          <option value="Tequila">Tequila</option>
          <option value="Whisky">Whisky</option>
          <option value="Ron">Ron</option>
          <option value="Vino tinto">Vino tinto</option>
          <option value="Ginebra">Ginebra</option>
          <option value="Vino">Vino</option>
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
      ) : products.length === 0 ? (
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
          products={products}
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
