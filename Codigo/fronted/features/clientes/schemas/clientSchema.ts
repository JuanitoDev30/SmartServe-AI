import { Pedido } from '@/features/pedidos/schemas/orderSchema';
import { z } from 'zod';

// Enum de estados
export const EstadoClienteEnum = z.enum(['ACTIVO', 'INACTIVO']);
export type EstadoCliente = z.infer<typeof EstadoClienteEnum>;

export const clienteSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefono: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  email: z.string().email('Email inválido').optional().nullable(),
  direccionPrincipal: z.string().optional().nullable(),
  estado: EstadoClienteEnum,
  totalPedidos: z.number().int().min(0).default(0),
  creadoEn: z.coerce.date(),
  actualizadoEn: z.coerce.date(),
});

export type Cliente = z.infer<typeof clienteSchema>;

// Schema para crear cliente
export const createClienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefono: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  email: z.string().email('Email inválido').optional().nullable(),
  direccionPrincipal: z.string().optional().nullable(),
  estado: EstadoClienteEnum.optional().default('ACTIVO'),
});

export type CreateClienteInput = z.infer<typeof createClienteSchema>;

// Schema para actualizar cliente
export const updateClienteSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .optional(),
  telefono: z
    .string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .optional(),
  email: z.string().email('Email inválido').optional().nullable(),
  direccionPrincipal: z.string().optional().nullable(),
  estado: EstadoClienteEnum.optional(),
});

export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;

// Schema para filtros de búsqueda
export const clienteFiltersSchema = z.object({
  search: z.string().optional().default(''),
  estado: EstadoClienteEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(['nombre', 'creadoEn', 'totalPedidos'])
    .optional()
    .default('creadoEn'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ClienteFilters = z.infer<typeof clienteFiltersSchema>;

export const paginatedClientesSchema = z.object({
  data: z.array(clienteSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type PaginatedClientes = z.infer<typeof paginatedClientesSchema>;

// Schema para estadísticas
export const clienteStatsSchema = z.object({
  total: z.number(),
  activos: z.number(),
  inactivos: z.number(),
  totalPedidos: z.number(),
  nuevosEsteMes: z.number(),
});

export type ClienteStats = z.infer<typeof clienteStatsSchema>;

export interface ClienteConPedidos extends Cliente {
  pedidos: Pedido[];
}
