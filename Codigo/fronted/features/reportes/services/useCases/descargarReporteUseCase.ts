import { reportesRepository } from '../repositories/reportesRepository';
class DescargarReporteUseCase {
  async execute(
    tipo: string,
    params: Record<string, string>,
    formato: 'excel' | 'pdf',
  ) {
    return reportesRepository.descargarReporte(tipo, params, formato);
  }
}
export const descargarReporteUseCase = new DescargarReporteUseCase();
