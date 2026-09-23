// Fuente única de tipos de mesas — reservas también importa de aquí

export const ZONAS_MESA = [
  'INTERIOR',
  'TERRAZA',
  'BARRA',
  'VIP',
  'PRIVADO',
] as const;

export type ZonaMesa = (typeof ZONAS_MESA)[number];

export const FORMAS_MESA = ['REDONDA', 'CUADRADA', 'RECTANGULAR'] as const;

export type FormaMesa = (typeof FORMAS_MESA)[number];

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  zona: ZonaMesa;
  activa: boolean;
  descripcion?: string | null;

  // Plano del salón — en unidades de grilla, no en píxeles.
  // posX/posY son el centro de la mesa; null = sin colocar todavía.
  forma: FormaMesa;
  posX?: number | null;
  posY?: number | null;
  /** null = tamaño derivado de la capacidad */
  ancho?: number | null;
  alto?: number | null;
  rotacion: number;

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
  forma?: FormaMesa;
  posX?: number;
  posY?: number;
  ancho?: number;
  alto?: number;
  rotacion?: number;
}

export type UpdateMesaInput = Partial<CreateMesaInput>;

/** Una mesa colocada en el plano, tal como la guarda el editor */
export interface MesaLayoutInput {
  id: string;
  posX: number;
  posY: number;
  forma?: FormaMesa;
  ancho?: number;
  alto?: number;
  rotacion?: number;
}

export interface UpdateLayoutInput {
  mesas: MesaLayoutInput[];
}
