import { ventasRepository } from '../repositories/ventasRepository';

class GetHistorialVentasUseCase {
  async execute(
    page: number,
    pageSize: number,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    return ventasRepository.getHistorial(page, pageSize, fechaInicio, fechaFin);
  }
}
export const getHistorialVentasUseCase = new GetHistorialVentasUseCase();
