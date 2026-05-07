import { z } from 'zod';

export const estadoPedidoOptions = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'EN_PREPARACION', label: 'En Preparacion' },
  { value: 'EN_CAMINO', label: 'En Camino' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'CANCELADO', label: 'Cancelado' },
] as const;

export const metodoPagoOptions = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TARJETA', label: 'Tarjeta' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'PSE', label: 'PSE' },
] as const;

export type EstadoPedido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO';

export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'PSE';

export const pedidoItemSchema = z.object({
  id: z.string(),
  cantidad: z.number().min(1, 'La cantidad debe ser al menos 1'),
  precioUnitario: z.number().min(0, 'El precio debe ser positivo'),
  subtotalItem: z.number(),
  producto: z.object({
    id: z.string(),
    nombre: z.string(),
    precio: z.number(),
  }),
});

export const clienteSchema = z.object({
  id: z.string(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefono: z.string().min(7, 'El telefono debe tener al menos 7 digitos'),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
});

export const pedidoSchema = z.object({
  id: z.string(),
  estado: z.enum([
    'PENDIENTE',
    'CONFIRMADO',
    'EN_PREPARACION',
    'EN_CAMINO',
    'ENTREGADO',
    'CANCELADO',
  ]),
  subTotal: z.number().min(0),
  total: z.number().min(0),
  direccion: z.string().min(5, 'La direccion debe tener al menos 5 caracteres'),
  metodoPago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PSE']),
  notas: z.string().optional(),
  items: z.array(pedidoItemSchema).min(1, 'Debe haber al menos un item'),
  cliente: clienteSchema,
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

// Schema for editing a pedido (partial, excludes computed fields)
export const pedidoFormSchema = z.object({
  estado: z.enum([
    'PENDIENTE',
    'CONFIRMADO',
    'EN_PREPARACION',
    'EN_CAMINO',
    'ENTREGADO',
    'CANCELADO',
  ]),
  direccion: z.string().min(5, 'La direccion debe tener al menos 5 caracteres'),
  metodoPago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PSE']),
  notas: z.string().optional(),
  cliente: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    telefono: z.string().min(7, 'El telefono debe tener al menos 7 digitos'),
    email: z.string().email('Email invalido').optional().or(z.literal('')),
  }),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type PedidoItem = z.infer<typeof pedidoItemSchema>;
export type Cliente = z.infer<typeof clienteSchema>;
export type Pedido = z.infer<typeof pedidoSchema>;
export type PedidoFormValues = z.infer<typeof pedidoFormSchema>;
