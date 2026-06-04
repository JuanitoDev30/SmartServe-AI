import { reportesRepository } from '../repositories/reportesRepository';
class GetReporteClientesUseCase {
  async execute(fechaInicio: string, fechaFin: string) {
    return reportesRepository.getReporteClientes(fechaInicio, fechaFin);
  }
}
export const getReporteClientesUseCase = new GetReporteClientesUseCase();
