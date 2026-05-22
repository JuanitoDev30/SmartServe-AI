import {
  GraficaItem,
  HistorialVentas,
  MetodoPago,
  PeriodoGrafica,
  PeriodoTopProductos,
  ResumenVentas,
  TopProducto,
} from '../../schemas/ventasSchema';

export interface VentasRepositoryInterface {
  getResumen(): Promise<ResumenVentas>;
  getGrafica(periodo: PeriodoGrafica): Promise<GraficaItem[]>;
  getTopProductos(
    limit: number,
    periodo: PeriodoTopProductos,
  ): Promise<TopProducto[]>;
  getMetodosPago(): Promise<MetodoPago[]>;
  getHistorial(
    page: number,
    pageSize: number,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<HistorialVentas>;
}
