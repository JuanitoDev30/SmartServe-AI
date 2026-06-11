import { z } from 'zod';

export const stockPorCategoriaSchema = z.object({
  categoria: z.string(),
  totalStock: z.number(),
  totalProductos: z.number(),
});

export const overviewSchema = z.object({
  pedidos: z.object({
    hoy: z.number(),
    creadosHoy: z.number(),
    pendientes: z.number(),
    enCamino: z.number(),
    completadosTotal: z.number(),
    semana: z.number(),
    mes: z.number(),
  }),
  ingresos: z.object({
    hoy: z.number(),
    estaSemana: z.number(),
    esteMes: z.number(),
    variacion: z.number(),
    tendencia: z.enum(['up', 'down']),
  }),
  clientes: z.object({
    total: z.number(),
    nuevosEsteMes: z.number(),
  }),
  ticketPromedio: z.number(),
  productosStockBajo: z.array(
    z.object({
      id: z.string(),
      nombre: z.string(),
      stock: z.number(),
    }),
  ),
  stockPorCategoria: z.array(stockPorCategoriaSchema),
  pedidosRecientes: z.array(z.any()),
});

export type StockPorCategoria = z.infer<typeof stockPorCategoriaSchema>;
export type Overview = z.infer<typeof overviewSchema>;
