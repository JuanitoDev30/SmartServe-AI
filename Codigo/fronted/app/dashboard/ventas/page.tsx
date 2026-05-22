import { getGraficaVentasAction } from '@/features/ventas/actions/getGraficaVentasActions';
import { getHistorialVentasAction } from '@/features/ventas/actions/getHistorialVentasActions';
import { getMetodosPagoAction } from '@/features/ventas/actions/getMetodoPagoVentasActions';
import { getResumenVentasAction } from '@/features/ventas/actions/getResumenVentasActions';
import { getTopProductosAction } from '@/features/ventas/actions/getTopProductosVentasActions';



export const metadata = {
  title: 'Ventas - Panel Administrativo',
  description: 'Módulo de ventas e ingresos',
};

export default async function VentasPage() {
  const [resumen, grafica, topProductos, metodosPago, historial] = await Promise.all([
    getResumenVentasAction(),
    getGraficaVentasAction('semana'),
    getTopProductosAction(5, 'mes'),
    getMetodosPagoAction(),
    getHistorialVentasAction(1, 10),
  ]);

  return (
    // <VentasDashboard
    //   initialResumen={resumen.success ? resumen.data ?? null : null}
    //   initialGrafica={grafica.success ? grafica.data ?? null : null}
    //   initialTopProductos={topProductos.success ? topProductos.data ?? null : null}
    //   initialMetodosPago={metodosPago.success ? metodosPago.data ?? null : null}
    //   initialHistorial={historial.success ? historial.data ?? null : null}
    // />
  );
}