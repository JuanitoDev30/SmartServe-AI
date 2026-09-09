// Fuente única de tipos de mesas — reservas también importa de aquí

export const ZONAS_MESA = [
  'INTERIOR',
  'TERRAZA',
  'BARRA',
  'VIP',
  'PRIVADO',
] as const;

export type ZonaMesa = (typeof ZONAS_MESA)[number];

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  zona: ZonaMesa;
  activa: boolean;
  descripcion?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface MesaStats {
  total: number;
  activas: number;
  inactivas: number;
  capacidadTotal: number;
}

export interface CreateMesaInput {
  numero: number;
  capacidad: number;
  zona: ZonaMesa;
  activa?: boolean;
  descripcion?: string;
}

export type UpdateMesaInput = Partial<CreateMesaInput>;
