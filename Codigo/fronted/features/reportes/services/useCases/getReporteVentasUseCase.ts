import { reportesRepository } from '../repositories/reportesRepository';

class GetReporteVentasUseCase {
  async execute(fechaInicio: string, fechaFin: string) {
    return reportesRepository.getReporteVentas(fechaInicio, fechaFin);
  }
}
export const getReporteVentasUseCase = new GetReporteVentasUseCase();
