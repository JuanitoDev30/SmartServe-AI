import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Pedido,
  pedidoFormSchema,
  PedidoFormValues,
  estadoPedidoOptions,
  metodoPagoOptions,
  EstadoPedido,
} from '@/lib/validations/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, FileText, MapPin, Save, User, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getEstadosPermitidos } from '@/features/pedidos/utils/transiciones';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PedidoFormValues) => void;
  order: Pedido | null;
  isLoading: boolean;
}

export function OrderFormModal({
  isOpen,
  onClose,
  onSubmit,
  order,
  isLoading = false,
}: OrderFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoFormSchema),
    defaultValues: {
      estado: 'PENDIENTE',
      direccion: '',
      metodoPago: 'EFECTIVO',
      notas: '',
      cliente: {
        nombre: '',
        telefono: '',
        email: '',
      },
    },
  }); // Reset form when order changes
  useEffect(() => {
    if (order) {
      reset({
        estado: order.estado,
        direccion: order.direccion,
        metodoPago: order.metodoPago,
        notas: order.notas || '',
        cliente: {
          nombre: order.cliente.nombre,
          telefono: order.cliente.telefono,
          email: order.cliente.email || '',
        },
      });
    }
  }, [order, reset]);

  const handleFormSubmit = (data: PedidoFormValues) => {
    onSubmit(data);
  };

  const estadosPermitidos = order ? getEstadosPermitidos(order.estado) : [];

  const opcionesFiltradas = estadoPedidoOptions.filter(
    op =>
      op.value === order?.estado || // mantener el actual
      estadosPermitidos.includes(op.value as EstadoPedido),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl mx-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Editar Pedido
            </h2>
            {order && (
              <p className="text-sm text-muted-foreground mt-0.5">
                #{order.id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="space-y-6">
            {/* Order Info Summary (Read Only) */}
            {order && (
              <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                <h3 className="text-sm font-medium text-foreground">
                  Resumen del Pedido
                </h3>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.cantidad}x {item.producto.nombre}
                      </span>
                      <span className="font-medium text-foreground">
                        ${item.subtotalItem.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-semibold text-primary text-lg">
                      ${order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Estado del Pedido */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <FileText className="size-4" />
                <h3 className="font-medium">Estado del Pedido</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {opcionesFiltradas.map(option => (
                  <label
                    key={option.value}
                    className={cn(
                      'relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all',
                      'hover:border-primary/50',
                      errors.estado ? 'border-destructive' : 'border-border',
                    )}
                  >
                    <input
                      type="radio"
                      {...register('estado')}
                      value={option.value}
                      className="peer sr-only"
                    />
                    <span className="peer-checked:text-primary">
                      {option.label}
                    </span>
                    <div className="absolute inset-0 rounded-lg ring-2 ring-primary opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </label>
                ))}
              </div>
              {errors.estado && (
                <p className="text-sm text-destructive">
                  {errors.estado.message}
                </p>
              )}
            </div>

            {/* Cliente */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <User className="size-4" />
                <h3 className="font-medium">Informacion del Cliente</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nombre
                  </label>
                  <Input
                    {...register('cliente.nombre')}
                    placeholder="Nombre del cliente"
                    className={cn(
                      errors.cliente?.nombre &&
                        'border-destructive focus-visible:ring-destructive',
                    )}
                  />
                  {errors.cliente?.nombre && (
                    <p className="text-sm text-destructive">
                      {errors.cliente.nombre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Telefono
                  </label>
                  <Input
                    {...register('cliente.telefono')}
                    placeholder="+57 300 123 4567"
                    className={cn(
                      errors.cliente?.telefono &&
                        'border-destructive focus-visible:ring-destructive',
                    )}
                  />
                  {errors.cliente?.telefono && (
                    <p className="text-sm text-destructive">
                      {errors.cliente.telefono.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Email (opcional)
                  </label>
                  <Input
                    {...register('cliente.email')}
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    className={cn(
                      errors.cliente?.email &&
                        'border-destructive focus-visible:ring-destructive',
                    )}
                  />
                  {errors.cliente?.email && (
                    <p className="text-sm text-destructive">
                      {errors.cliente.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Direccion */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="size-4" />
                <h3 className="font-medium">Direccion de Entrega</h3>
              </div>

              <div className="space-y-2">
                <Input
                  {...register('direccion')}
                  placeholder="Calle, numero, ciudad..."
                  className={cn(
                    errors.direccion &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                {errors.direccion && (
                  <p className="text-sm text-destructive">
                    {errors.direccion.message}
                  </p>
                )}
              </div>
            </div>

            {/* Metodo de Pago */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <CreditCard className="size-4" />
                <h3 className="font-medium">Metodo de Pago</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {metodoPagoOptions.map(option => (
                  <label
                    key={option.value}
                    className={cn(
                      'relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all',
                      'hover:border-primary/50',
                      errors.metodoPago
                        ? 'border-destructive'
                        : 'border-border',
                    )}
                  >
                    <input
                      type="radio"
                      {...register('metodoPago')}
                      value={option.value}
                      className="peer sr-only"
                    />
                    <span className="peer-checked:text-primary">
                      {option.label}
                    </span>
                    <div className="absolute inset-0 rounded-lg ring-2 ring-primary opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </label>
                ))}
              </div>
              {errors.metodoPago && (
                <p className="text-sm text-destructive">
                  {errors.metodoPago.message}
                </p>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Notas (opcional)
              </label>
              <textarea
                {...register('notas')}
                rows={3}
                placeholder="Instrucciones especiales, comentarios..."
                className={cn(
                  'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'resize-none',
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {isLoading ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
