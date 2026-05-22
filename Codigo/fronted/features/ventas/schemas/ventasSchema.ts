import { z } from 'zod';

export const resumenVentasSchema = z.object({
  hoy: z.object({
    ingresos: z.number(),
    ventas: z.number(),
  }),
  semana: z.object({
    ingresos: z.number(),
    ventas: z.number(),
  }),
  mes: z.object({
    ingresos: z.number(),
    ventas: z.number(),
  }),
  anio: z.object({
    ingresos: z.number(),
    ventas: z.number(),
  }),
  comparativa: z.object({
    mesAnterior: z.number(),
    variacionPorcentaje: z.number(),
    tendencia: z.enum(['up', 'down']),
  }),
  ticketPromedio: z.number(),
});

export const graficaItemSchema = z.object({
  label: z.string(),
  total: z.number(),
  count: z.number(),
});

export const topProductoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  cantidadTotal: z.number(),
  ingresos: z.number(),
});

export const metodoPagoSchema = z.object({
  metodoPago: z.string(),
  count: z.number(),
  total: z.number(),
  porcentaje: z.number(),
});

export const historialVentasSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type ResumenVentas = z.infer<typeof resumenVentasSchema>;
export type GraficaItem = z.infer<typeof graficaItemSchema>;
export type TopProducto = z.infer<typeof topProductoSchema>;
export type MetodoPago = z.infer<typeof metodoPagoSchema>;
export type HistorialVentas = z.infer<typeof historialVentasSchema>;
export type PeriodoGrafica = 'dia' | 'semana' | 'mes';
export type PeriodoTopProductos = 'semana' | 'mes' | 'anio' | 'todo';
