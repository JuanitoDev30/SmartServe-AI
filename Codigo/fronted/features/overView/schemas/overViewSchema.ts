import { z } from 'zod';

export const overviewSchema = z.object({
  pedidos: z.object({
    hoy: z.number(),
    pendientes: z.number(),
    completadosTotal: z.number(),
  }),
  ingresos: z.object({
    hoy: z.number(),
    esteMes: z.number(),
    variacion: z.number(),
    tendencia: z.enum(['up', 'down']),
  }),
  clientes: z.object({
    total: z.number(),
    nuevosEsteMes: z.number(),
  }),
  productosStockBajo: z.array(
    z.object({
      id: z.string(),
      nombre: z.string(),
      stock: z.number(),
    }),
  ),
  pedidosRecientes: z.array(z.any()),
});

export type Overview = z.infer<typeof overviewSchema>;
