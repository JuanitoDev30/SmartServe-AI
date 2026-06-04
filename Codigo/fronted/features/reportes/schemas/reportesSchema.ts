import z from 'zod';

export const periodoSchema = z.object({
  inicio: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'La fecha de inicio debe ser una fecha válida',
  }),
  fin: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'La fecha de fin debe ser una fecha válida',
  }),
});

export const reporteVentasSchema = z.object({
  periodo: periodoSchema,
  totalVentas: z.number(),
  totalBruto: z.number(),
  totalIva: z.number(),
  totalNeto: z.number(),
  ventas: z.array(
    z.object({
      id: z.string(),
      fecha: z.coerce.date(),
      cliente: z.string(),
      telefono: z.string(),
      productos: z.array(
        z.object({
          nombre: z.string(),
          cantidad: z.number(),
          precioUnitario: z.number(),
          subtotal: z.number(),
          ivaPercent: z.number(),
        }),
      ),
      metodoPago: z.string(),
      subtotal: z.number(),
      total: z.number(),
      iva: z.number(),
    }),
  ),
});

export const reporteProductosSchema = z.object({
  periodo: periodoSchema,
  productos: z.array(
    z.object({
      id: z.string(),
      nombre: z.string(),
      categoria: z.string(),
      ivaPercent: z.number(),
      cantidadVendida: z.number(),
      ingresos: z.number(),
      pedidos: z.number(),
      stockActual: z.number(),
    }),
  ),
});

export const reporteClientesSchema = z.object({
  periodo: periodoSchema,
  totalClientes: z.number(),
  clientes: z.array(
    z.object({
      id: z.string(),
      nombre: z.string(),
      telefono: z.string(),
      email: z.string().nullable(),
      totalPedidos: z.number(),
      totalGastado: z.number(),
      ticketPromedio: z.number(),
      ultimaCompra: z.coerce.date(),
    }),
  ),
});

export const reporteContableSchema = z.object({
  periodo: z.object({
    mes: z.string(),
    anio: z.number(),
  }),
  empresa: z.string(),
  resumenIva: z.object({
    baseExenta: z.number(),
    baseGravable5: z.number(),
    iva5: z.number(),
    baseGravable19: z.number(),
    iva19: z.number(),
    totalBase: z.number(),
    totalIva: z.number(),
    totalBruto: z.number(),
  }),
  ventas: z.array(
    z.object({
      consecutivo: z.string(),
      fecha: z.string(),
      cliente: z.string(),
      nit: z.string(),
      descripcion: z.string(),
      metodoPago: z.string(),
      baseGravable: z.number(),
      iva: z.number(),
      total: z.number(),
    }),
  ),
});

export type ReporteVentas = z.infer<typeof reporteVentasSchema>;
export type ReporteProductos = z.infer<typeof reporteProductosSchema>;
export type ReporteClientes = z.infer<typeof reporteClientesSchema>;
export type ReporteContable = z.infer<typeof reporteContableSchema>;
export type FormatoReporte = 'json' | 'excel' | 'pdf';
