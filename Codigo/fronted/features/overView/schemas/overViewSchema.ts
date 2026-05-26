import { z } from 'zod';

export const overviewSchema = z.object({
  pedidos: z.object({
    hoy: z.number(),
    pendientes: z.number(),
    enCamino: z.number(),
    completadosTotal: z.number(),
    semana: z.number(),
    mes: z.number(),
  }),
  ingresos: z.object({
    hoy: z.number(),
    esteMes: z.number(),
    estaSemana: z.number(),
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
  pedidosRecientes: z.array(z.any()),
});

export type Overview = z.infer<typeof overviewSchema>;
