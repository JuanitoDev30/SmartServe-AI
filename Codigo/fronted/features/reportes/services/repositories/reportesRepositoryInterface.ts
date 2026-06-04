import {
  ReporteClientes,
  ReporteContable,
  ReporteProductos,
  ReporteVentas,
} from '../../schemas/reportesSchema';

export interface ReportesRepositoryInterface {
  getReporteVentas(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteVentas>;

  getReporteProductos(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteProductos>;

  getReporteClientes(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteClientes>;

  getReporteContable(mes: number, anio: number): Promise<ReporteContable>;

  descargarReporte(
    tipo: string,
    params: Record<string, string>,
    formato: 'excel' | 'pdf',
  ): Promise<Blob>;
}
