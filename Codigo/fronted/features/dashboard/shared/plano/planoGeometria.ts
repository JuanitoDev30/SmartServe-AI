import {
  ZONAS_MESA,
  type Mesa,
  type ZonaMesa,
} from '@/features/mesas/schemas/mesaSchema';

import { CELDA, PLANO_ALTO, PLANO_ANCHO } from './planoConstants';

/** Mesa con posición y tamaño ya resueltos, en unidades de grilla */
export interface MesaColocada {
  mesa: Mesa;
  /** Centro */
  x: number;
  y: number;
  ancho: number;
  alto: number;
  rotacion: number;
  /** true si la posición la inventó el auto-acomodo (la mesa no está guardada) */
  autoUbicada: boolean;
}

export const aPx = (unidades: number) => unidades * CELDA;

export const clamp = (valor: number, min: number, max: number) =>
  Math.min(max, Math.max(min, valor));

/**
 * Tamaño por defecto según la capacidad. Se usa cuando la mesa todavía no
 * tiene un tamaño propio: una mesa de 8 debe verse más grande que una de 2.
 */
export function tamanoPorDefecto(mesa: Pick<Mesa, 'capacidad' | 'forma'>): {
  ancho: number;
  alto: number;
} {
  const capacidad = clamp(mesa.capacidad, 1, 20);

  if (mesa.forma === 'RECTANGULAR') {
    return {
      ancho: clamp(Math.ceil(capacidad / 2) * 2, 4, 16),
      alto: capacidad > 10 ? 4 : 3,
    };
  }

  const lado =
    capacidad <= 2 ? 3 : capacidad <= 4 ? 4 : capacidad <= 6 ? 5 : capacidad <= 9 ? 6 : 7;

  return { ancho: lado, alto: lado };
}

export function dimensionesMesa(mesa: Mesa): { ancho: number; alto: number } {
  const porDefecto = tamanoPorDefecto(mesa);

  return {
    ancho: mesa.ancho ?? porDefecto.ancho,
    alto: mesa.forma === 'REDONDA' ? (mesa.ancho ?? porDefecto.ancho) : (mesa.alto ?? porDefecto.alto),
  };
}

/**
 * Separación entre mesas de una misma zona. Tiene que dar cabida a las
 * sillas de ambas, que sobresalen ~1 casilla por lado.
 */
const SEPARACION = 3;
/** Separación entre bloques de zona: deja sitio al recuadro de cada zona */
const GAP_BLOQUE = 4;
/** Ancho máximo de un bloque de zona, para que quepan varios de lado a lado */
const ANCHO_BLOQUE = 18;
const MARGEN = 2;

interface MesaEnBloque {
  mesa: Mesa;
  ancho: number;
  alto: number;
  /** Centro, relativo al origen del bloque */
  x: number;
  y: number;
}

/** Acomoda las mesas de una zona en filas, sin pasarse de ANCHO_BLOQUE */
function armarBloque(mesas: Mesa[]): {
  mesas: MesaEnBloque[];
  ancho: number;
  alto: number;
} {
  const items: MesaEnBloque[] = [];

  let x = 0;
  let y = 0;
  let altoFila = 0;
  let anchoMax = 0;

  for (const mesa of mesas) {
    const { ancho, alto } = dimensionesMesa(mesa);

    if (x > 0 && x + ancho > ANCHO_BLOQUE) {
      x = 0;
      y += altoFila + SEPARACION;
      altoFila = 0;
    }

    items.push({ mesa, ancho, alto, x: x + ancho / 2, y: y + alto / 2 });

    x += ancho + SEPARACION;
    altoFila = Math.max(altoFila, alto);
    anchoMax = Math.max(anchoMax, x - SEPARACION);
  }

  return { mesas: items, ancho: anchoMax, alto: y + altoFila };
}

/**
 * Acomoda las mesas que todavía no tienen posición guardada: una caja por
 * zona, y las cajas repartidas de izquierda a derecha bajando de línea
 * cuando se acaba el ancho. Es lo que hace que el plano se vea razonable
 * desde el primer momento, antes de que nadie abra el editor.
 */
export function colocarMesas(mesas: Mesa[]): MesaColocada[] {
  const colocadas: MesaColocada[] = [];

  const sinPosicion = mesas.filter(
    mesa => mesa.posX == null || mesa.posY == null,
  );

  let cursorX = MARGEN;
  let cursorY = MARGEN;
  let altoEstante = 0;

  for (const zona of ZONAS_MESA) {
    const deLaZona = sinPosicion.filter(mesa => mesa.zona === zona);
    if (deLaZona.length === 0) continue;

    const bloque = armarBloque(deLaZona);

    // No cabe a la derecha: baja al siguiente estante
    if (cursorX > MARGEN && cursorX + bloque.ancho > PLANO_ANCHO - MARGEN) {
      cursorX = MARGEN;
      cursorY += altoEstante + GAP_BLOQUE;
      altoEstante = 0;
    }

    for (const item of bloque.mesas) {
      // Centros en casillas enteras, que es la precisión que guarda el
      // backend, y siempre dentro del salón aunque haya muchísimas mesas.
      const posicion = limitarAlPlano(
        Math.round(cursorX + item.x),
        Math.round(cursorY + item.y),
        item.ancho,
        item.alto,
      );

      colocadas.push({
        mesa: item.mesa,
        ...posicion,
        ancho: item.ancho,
        alto: item.alto,
        rotacion: item.mesa.rotacion ?? 0,
        autoUbicada: true,
      });
    }

    cursorX += bloque.ancho + GAP_BLOQUE;
    altoEstante = Math.max(altoEstante, bloque.alto);
  }

  for (const mesa of mesas) {
    if (mesa.posX == null || mesa.posY == null) continue;

    const { ancho, alto } = dimensionesMesa(mesa);

    colocadas.push({
      mesa,
      x: mesa.posX,
      y: mesa.posY,
      ancho,
      alto,
      rotacion: mesa.rotacion ?? 0,
      autoUbicada: false,
    });
  }

  return colocadas.sort((a, b) => a.mesa.numero - b.mesa.numero);
}

/**
 * Mantiene la mesa completa dentro del salón. Los topes se redondean hacia
 * arriba para que el centro siga cayendo en una casilla entera, que es la
 * precisión con la que se guarda.
 */
export function limitarAlPlano(
  x: number,
  y: number,
  ancho: number,
  alto: number,
): { x: number; y: number } {
  const margenX = Math.ceil(ancho / 2);
  const margenY = Math.ceil(alto / 2);

  return {
    x: clamp(x, margenX, PLANO_ANCHO - margenX),
    y: clamp(y, margenY, PLANO_ALTO - margenY),
  };
}

export interface Silla {
  x: number;
  y: number;
  /** Grados: hacia dónde mira la silla */
  angulo: number;
}

/**
 * Reparte `capacidad` sillas alrededor de la mesa. En redondas van sobre la
 * circunferencia; en rectas se reparten por lados, proporcional a lo largo
 * de cada uno, de modo que una mesa alargada tenga más sillas al frente.
 */
export function sillasDeMesa(
  capacidad: number,
  ancho: number,
  alto: number,
  forma: Mesa['forma'],
  separacion = 0.75,
): Silla[] {
  const total = clamp(Math.round(capacidad), 1, 20);

  if (forma === 'REDONDA') {
    const radio = ancho / 2 + separacion;

    return Array.from({ length: total }, (_, i) => {
      // Arranca arriba y gira en sentido horario
      const angulo = (i / total) * 360 - 90;
      const rad = (angulo * Math.PI) / 180;

      return {
        x: Math.cos(rad) * radio,
        y: Math.sin(rad) * radio,
        angulo: angulo + 90,
      };
    });
  }

  const proporcionH = ancho / (2 * (ancho + alto));
  const arriba = Math.ceil(total * proporcionH);
  const abajo = Math.floor(total * proporcionH);
  const restantes = total - arriba - abajo;
  const izquierda = Math.ceil(restantes / 2);
  const derecha = restantes - izquierda;

  const sillas: Silla[] = [];
  const offsetY = alto / 2 + separacion;
  const offsetX = ancho / 2 + separacion;

  const repartir = (n: number, largo: number) =>
    Array.from({ length: n }, (_, i) => ((i + 0.5) / n - 0.5) * largo);

  for (const x of repartir(arriba, ancho)) {
    sillas.push({ x, y: -offsetY, angulo: 0 });
  }
  for (const x of repartir(abajo, ancho)) {
    sillas.push({ x, y: offsetY, angulo: 180 });
  }
  for (const y of repartir(izquierda, alto)) {
    sillas.push({ x: -offsetX, y, angulo: 90 });
  }
  for (const y of repartir(derecha, alto)) {
    sillas.push({ x: offsetX, y, angulo: 270 });
  }

  return sillas;
}

/**
 * Mesas que se pisan entre sí. Es una comprobación por caja envolvente (no
 * tiene en cuenta la rotación): basta para avisar en el editor de que el
 * salón quedó mal repartido.
 */
export function mesasSolapadas(colocadas: MesaColocada[]): Set<string> {
  const ids = new Set<string>();

  for (let i = 0; i < colocadas.length; i++) {
    for (let j = i + 1; j < colocadas.length; j++) {
      const a = colocadas[i];
      const b = colocadas[j];

      const pisaX = Math.abs(a.x - b.x) * 2 < a.ancho + b.ancho;
      const pisaY = Math.abs(a.y - b.y) * 2 < a.alto + b.alto;

      if (pisaX && pisaY) {
        ids.add(a.mesa.id);
        ids.add(b.mesa.id);
      }
    }
  }

  return ids;
}

export interface AreaZona {
  zona: ZonaMesa;
  x: number;
  y: number;
  ancho: number;
  alto: number;
}

/**
 * Caja que envuelve las mesas de cada zona. No se guarda nada: se deduce de
 * dónde quedaron las mesas, así el salón se lee por bloques sin obligar a
 * nadie a dibujar paredes.
 */
export function areasDeZona(colocadas: MesaColocada[], margen = 1.5): AreaZona[] {
  const porZona = new Map<ZonaMesa, MesaColocada[]>();

  for (const colocada of colocadas) {
    const lista = porZona.get(colocada.mesa.zona) ?? [];
    lista.push(colocada);
    porZona.set(colocada.mesa.zona, lista);
  }

  const areas: AreaZona[] = [];

  for (const [zona, lista] of porZona) {
    const x1 = Math.min(...lista.map(c => c.x - c.ancho / 2)) - margen;
    const y1 = Math.min(...lista.map(c => c.y - c.alto / 2)) - margen;
    const x2 = Math.max(...lista.map(c => c.x + c.ancho / 2)) + margen;
    const y2 = Math.max(...lista.map(c => c.y + c.alto / 2)) + margen;

    areas.push({ zona, x: x1, y: y1, ancho: x2 - x1, alto: y2 - y1 });
  }

  return areas;
}
