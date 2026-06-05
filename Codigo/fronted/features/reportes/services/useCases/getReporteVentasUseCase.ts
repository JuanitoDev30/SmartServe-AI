import { reportesRepository } from '../repositories/reportesRepository';

class GetReporteVentasUseCase {
  async execute(fechaInicio: string, fechaFin: string) {
    // console.log('Ejecutando caso de uso para reporte de ventas');
    return reportesRepository.getReporteVentas(fechaInicio, fechaFin);
  }
}
export const getReporteVentasUseCase = new GetReporteVentasUseCase();
