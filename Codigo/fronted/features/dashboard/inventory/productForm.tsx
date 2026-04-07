'use client';

import { useState, useEffect } from 'react';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ProductType,
  ProductFormData,
  ProductCategory,
  ProductStatus,
} from '@/features/users/schemas/productSchema';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  product?: ProductType | null;
  isLoading?: boolean;
}

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'Aguardiente', label: 'Aguardiente' },
  { value: 'Cerveza', label: 'Cerveza' },
  { value: 'Snacks', label: 'Snacks' },
  { value: 'Tequila', label: 'Tequila' },
  { value: 'Whisky', label: 'Whisky' },
  { value: 'Ron', label: 'Ron' },
  { value: 'Vino tinto', label: 'Vino tinto' },
  { value: 'Ginebra', label: 'Ginebra' },
  { value: 'Vino', label: 'Vino' },

 
];

const statuses: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'low_stock', label: 'Stock bajo' },
  { value: 'out_of_stock', label: 'Sin stock' },
];

const defaultFormData: ProductFormData = {
  nombre: '',
  precio: 0,
  descripcion: '',
  slug: '',
  stock: 0,
  proveedor: '',
  status: 'active',
  categoria: 'Aguardiente',

  //minStock: 5,
};

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        precio: product.precio || 0,
        descripcion: product.descripcion || '',
        slug: product.slug || '',
        //costPrice: product.precio || 0,
        stock: product.stock || 0,
        proveedor: product.proveedor || '',
        // minStock: product.minStock,
        status: product.status,
        categoria: product.categoria,
        //imageUrl: product.imageUrl,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="p-6 space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre del producto
              </label>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Aguardiente"
                required
                className="h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Descripcion
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                placeholder="Descripcion del producto..."
                rows={3}
                className="flex w-full rounded-lg border border-input bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* SKU & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  SKU
                </label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="Ej: PROD-001"
                  required
                  className="h-11 font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Categoria
                </label>
                <select

                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-lg border border-input bg-input px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Precio de venta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="h-11 pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Stock actual
                </label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  className="h-11 w-50"
                />
              </div>
                {/* <label className="text-sm font-medium text-foreground">
                  Costo
                </label> */}
                {/* <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="h-11 pl-7"
                  />
                </div> */}
              </div>
            </div>

            {/* Stock & Min Stock */}
           
              {/* <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Stock minimo
                </label>
                <Input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  min="0"
                  required
                  className="h-11"
                />
              </div> */}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-11 w-full rounded-lg border border-input bg-input px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
             
            type="submit" disabled={isLoading}>
              {isLoading
                ? 'Guardando...'
                : product
                  ? 'Actualizar'
                  : 'Crear producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
