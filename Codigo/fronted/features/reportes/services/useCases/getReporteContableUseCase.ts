import { reportesRepository } from '../repositories/reportesRepository';
class GetReporteContableUseCase {
  async execute(mes: number, anio: number) {
    return reportesRepository.getReporteContable(mes, anio);
  }
}
export const getReporteContableUseCase = new GetReporteContableUseCase();
