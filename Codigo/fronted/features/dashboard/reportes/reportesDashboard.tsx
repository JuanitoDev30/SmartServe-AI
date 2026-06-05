'use client';
import { useState } from 'react';
import {
  getHoy,
  getPrimerDiaMes,
  meses,
  TabReporte,
} from '../shared/constants/reporteConstants';
import {
  ReporteClientes,
  ReporteContable,
  ReporteProductos,
  ReporteVentas,
} from '@/features/reportes/schemas/reportesSchema';
import { getReporteVentasAction } from '@/features/reportes/actions/getReporteVentasAction';
import { getReporteProductosAction } from '@/features/reportes/actions/getReporteProductosAction';
import { getReporteClientesAction } from '@/features/reportes/actions/getReporteClientesAction';
import { getReporteContableAction } from '@/features/reportes/actions/getReporteContableActions';
import { toast } from '@/hooks/useToast';
import { file } from 'zod';
import { descargarReporteUseCase } from '@/features/reportes/services/useCases/descargarReporteUseCase';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { ReporteTabs } from '@/components/reportes/reporteTabs';
import { ReportreFiltros } from '@/components/reportes/reporteFiltros';
import { ReporteVentasView } from './ventas/reporteVentasView';
import { ReporteContableView } from './contable/reportesContableView';
import { ReporteClientesView } from './clientes/reporteClientesView';
import { ReporteProductosView } from './productos/reporteProductosView';
import { ReporteEmptyState } from '@/components/reportes/reporteEmptyState';

export function ReportesDashboard() {
  const [activeTab, setActiveTab] = useState<TabReporte>('ventas');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownLoading, setIsDownloadig] = useState(false);

  //filtros fecha

  const [fechaInicio, setFechaInicio] = useState(getPrimerDiaMes());
  const [fechaFin, setFechaFin] = useState(getHoy());

  //filtros contable

  const now = new Date();
  const [mesContable, setMesContable] = useState(now.getMonth() + 1);
  const [anioContable, setAnioContable] = useState(now.getFullYear());

  // Datos
  const [reporteVentas, setReporteVentas] = useState<ReporteVentas | null>(
    null,
  );
  const [reporteProductos, setReporteProductos] =
    useState<ReporteProductos | null>(null);
  const [reporteClientes, setReporteClientes] =
    useState<ReporteClientes | null>(null);
  const [reporteContable, setReporteContable] =
    useState<ReporteContable | null>(null);

  const handleGenerar = async () => {
    setIsLoading(true);

    try {
      if (activeTab === 'ventas') {
        const result = await getReporteVentasAction(fechaInicio, fechaFin);

        if (result.success) setReporteVentas(result.data ?? null);
        else
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
            duration: 3000,
          });
      } else if (activeTab === 'productos') {
        const result = await getReporteProductosAction(fechaInicio, fechaFin);
        if (result.success) setReporteProductos(result.data ?? null);
        else
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
            duration: 3000,
          });
      } else if (activeTab === 'clientes') {
        const result = await getReporteClientesAction(fechaInicio, fechaFin);
        if (result.success) setReporteClientes(result.data ?? null);
        else
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
            duration: 3000,
          });
      } else if (activeTab === 'contable') {
        const result = await getReporteContableAction(
          mesContable,
          anioContable,
        );
        if (result.success) setReporteContable(result.data ?? null);
        else
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
            duration: 3000,
          });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescargar = async (formato: 'excel' | 'pdf') => {
    setIsDownloadig(true);

    try {
      let tipo = '';
      let params: Record<string, string> = {};
      let filename = '';

      if (activeTab === 'ventas') {
        tipo = 'ventas';
        params = { fechaInicio, fechaFin };
        filename = `reporte_ventas_${fechaInicio}_${fechaFin}.${formato === 'excel' ? 'xlsx' : 'pdf'}`;
      } else if (activeTab === 'productos') {
        tipo = 'productos';
        params = { fechaInicio, fechaFin };
        filename = `reporte_productos_${fechaInicio}_${fechaFin}.${formato === 'excel' ? 'xlsx' : 'pdf'}`;
      } else if (activeTab === 'clientes') {
        tipo = 'clientes';
        params = { fechaInicio, fechaFin };
        filename = `reporte_clientes_${fechaInicio}_${fechaFin}.${formato === 'excel' ? 'xlsx' : 'pdf'}`;
      } else if (activeTab === 'contable') {
        tipo = 'contable';
        params = { mes: mesContable.toString(), anio: anioContable.toString() };
        filename = `reporte_contable_${meses[mesContable - 1]}_${anioContable}.${formato === 'excel' ? 'xlsx' : 'pdf'}`;
      }

      const blob = await descargarReporteUseCase.execute(tipo, params, formato);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      toast({
        title: 'Descarga iniciada',
        description: filename,
        duration: 3000,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error al descargar',
        duration: 3000,
      });
    } finally {
      setIsDownloadig(false);
    }
  };

  const hasData = () => {
    if (activeTab === 'ventas') return !!reporteVentas;
    if (activeTab === 'productos') return !!reporteProductos;
    if (activeTab === 'clientes') return !!reporteClientes;
    if (activeTab === 'contable') return !!reporteContable;

    return false;
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Reportes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Genera y exporta reportes detallados sobre ventas, productos,
            clientes y contabilidad para tomar decisiones informadas.
          </p>
        </div>
      </div>

      {/* tabs */}
      <ReporteTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filtros */}

      <ReportreFiltros
        activeTab={activeTab}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        mesContable={mesContable}
        anioContable={anioContable}
        isDownloading={isDownLoading}
        isLoading={isLoading}
        hasData={hasData()}
        onFechaInicioChange={setFechaInicio}
        onFechaFinChange={setFechaFin}
        onMesContableChange={setMesContable}
        onAnioContableChange={setAnioContable}
        onGenerar={handleGenerar}
        onDescargar={handleDescargar}
      />

      {/* Contenido del reporte */}

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="size-10 rounded-full border-3 border-primary/30 border-t-primary"
              />
              <p className="text-sm text-muted-foreground">
                Generando reporte...
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {activeTab === 'ventas' && reporteVentas && (
              <motion.div
                key="ventas"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReporteVentasView data={reporteVentas} />
              </motion.div>
            )}

            {activeTab === 'productos' && reporteProductos && (
              <motion.div
                key="productos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReporteProductosView data={reporteProductos} />
              </motion.div>
            )}
            {activeTab === 'clientes' && reporteClientes && (
              <motion.div
                key="clientes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReporteClientesView data={reporteClientes} />
              </motion.div>
            )}
            {activeTab === 'contable' && reporteContable && (
              <motion.div
                key="contable"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReporteContableView data={reporteContable} />
              </motion.div>
            )}

            {/* Empty State */}
            {!hasData() && <ReporteEmptyState />}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
