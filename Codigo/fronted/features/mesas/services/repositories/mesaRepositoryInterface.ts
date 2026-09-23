import {
  CreateMesaInput,
  Mesa,
  MesaStats,
  UpdateLayoutInput,
  UpdateMesaInput,
} from '../../schemas/mesaSchema';

export interface MesaRepositoryInterface {
  getAll(soloActivas?: boolean): Promise<Mesa[]>;
  getById(id: string): Promise<Mesa>;
  getStats(): Promise<MesaStats>;
  create(data: CreateMesaInput): Promise<Mesa>;
  update(id: string, data: UpdateMesaInput): Promise<Mesa>;
  cambiarDisponibilidad(id: string, activa: boolean): Promise<Mesa>;
  updateLayout(data: UpdateLayoutInput): Promise<Mesa[]>;
  remove(id: string): Promise<{ mensaje: string }>;
}
