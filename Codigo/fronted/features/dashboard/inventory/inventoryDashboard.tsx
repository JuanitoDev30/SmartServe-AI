'use client';

import { useState, useEffect, useCallback } from 'react';


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
import { ProductCategory, ProductFormData, ProductStatus, ProductType } from '@/features/users/schemas/productSchema';
import { clonePageVaryPathWithNewSearchParams } from 'next/dist/client/components/segment-cache/vary-path';

type ViewMode = 'grid' | 'table';

interface Stats {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export function InventoryDashboard() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [status, setStatus] = useState<ProductStatus | ''>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const products = await getProductsAction();

      setProducts(products);

      // 👉 stats temporal (puedes moverlo luego a use-case)
      const statsCalculated = {
        total: products.length,
        active: products.filter(p => p.stock > 0).length,
        lowStock: products.filter(p => p.stock > 0 && p.stock < 5).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        totalValue: products.reduce((acc, p) => acc + p.precio * p.stock, 0),
      };

      setStats(statsCalculated);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
  
    try {
      if (selectedProduct) {
        
        console.log('Update pendiente');
      } else {
        const result = await createProductActions(data);
  
        if (!result.success) {
          console.log('Error creating product:', result, result.error);
          throw new Error(result.error);
        }
      }
  
      setIsFormOpen(false);
      await loadData(); 
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleConfirmDelete = async () => {
  //   if (!selectedProduct) return;
  //   setIsSubmitting(true);
  //   try {
  //     await deleteProduct(selectedProduct.id);
  //     setIsDeleteOpen(false);
  //     setSelectedProduct(null);
  //     loadData();
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
          <option value="food">Alimentos</option>
          <option value="beverages">Bebidas</option>
          <option value="electronics">Electronica</option>
          <option value="clothing">Ropa</option>
          <option value="other">Otros</option>
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
          onClick={loadData}
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
          {products.map(product => (
            <ProductCard
              key={product.slug}
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
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {}}
        product={selectedProduct}
        isLoading={isSubmitting}
      />
    </div>
  );
}
