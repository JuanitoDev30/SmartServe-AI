import { getApiWithAuth } from '@/db/apiWithAuth';
import {
  ReporteClientes,
  ReporteContable,
  ReporteProductos,
  ReporteVentas,
} from '../../schemas/reportesSchema';
import { ReportesRepositoryInterface } from './reportesRepositoryInterface';
import { AxiosResponse } from 'axios';

class ReportesRepository implements ReportesRepositoryInterface {
  async getReporteVentas(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteVentas> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reportes/ventas', {
      params: { fechaInicio, fechaFin, formato: 'json' },
    });

    console.log('Reporte Ventas:', data);
    return data;
  }

  async getReporteProductos(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteProductos> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reportes/productos', {
      params: { fechaInicio, fechaFin, formato: 'json' },
    });
    return data;
  }

  async getReporteClientes(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteClientes> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reportes/clientes', {
      params: { fechaInicio, fechaFin, formato: 'json' },
    });
    return data;
  }

  async getReporteContable(
    mes: number,
    anio: number,
  ): Promise<ReporteContable> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reportes/contable', {
      params: { mes, anio, formato: 'json' },
    });
    return data;
  }

  async descargarReporte(
    tipo: string,
    params: Record<string, string>,
    formato: 'excel' | 'pdf',
  ): Promise<AxiosResponse<ArrayBuffer>> {
    const api = await getApiWithAuth();

    return api.get<ArrayBuffer>(`/reportes/${tipo}`, {
      params: {
        ...params,
        formato,
      },
      responseType: 'arraybuffer',
    });
  }
}

export const reportesRepository = new ReportesRepository();
