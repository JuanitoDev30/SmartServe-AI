import { reportesRepository } from '../repositories/reportesRepository';

class GetReporteProductosUseCase {
  async execute(fechaInicio: string, fechaFin: string) {
    return reportesRepository.getReporteProductos(fechaInicio, fechaFin);
  }
}

export const getReporteProductosUseCase = new GetReporteProductosUseCase();
