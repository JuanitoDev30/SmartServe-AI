import api from '@/db/axios';
import {
  GraficaItem,
  HistorialVentas,
  MetodoPago,
  PeriodoGrafica,
  PeriodoTopProductos,
  ResumenVentas,
  TopProducto,
} from '../../schemas/ventasSchema';
import { VentasRepositoryInterface } from './ventasRepositoryInterface';

class VentasRepository implements VentasRepositoryInterface {
  async getResumen(): Promise<ResumenVentas> {
    const { data } = await api.get('/ventas/resumen');
    return data;
  }

  async getGrafica(_periodo: PeriodoGrafica): Promise<GraficaItem[]> {
    const { data } = await api.get('/ventas/grafica', { params: { periodo } });
    return data;
  }
  async getTopProductos(
    limit: number,
    periodo: PeriodoTopProductos,
  ): Promise<TopProducto[]> {
    const { data } = await api.get('/ventas/top-productos', {
      params: { limit, periodo },
    });
    return data;
  }

  async getMetodosPago(): Promise<MetodoPago[]> {
    const { data } = await api.get('/ventas/metodos-pago');
    return data;
  }

  async getHistorial(
    page: number,
    pageSize: number,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<HistorialVentas> {
    const { data } = await api.get('/ventas/historial', {
      params: { page, pageSize, fechaInicio, fechaFin },
    });
    return data;
  }
}

export const ventasRepository = new VentasRepository();
