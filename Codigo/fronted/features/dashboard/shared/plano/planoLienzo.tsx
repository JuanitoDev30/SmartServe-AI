'use client';

import {
  useCallback,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { Maximize2, Minus, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ZONA_MESA_CONFIG } from '../constants/reservaConstants';

import { CELDA, PLANO_ALTO, PLANO_ANCHO, ZONA_PLANO_CONFIG } from './planoConstants';
import { clamp, type AreaZona } from './planoGeometria';

const ANCHO_PX = PLANO_ANCHO * CELDA;
const ALTO_PX = PLANO_ALTO * CELDA;

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

/**
 * Convierte coordenadas de pantalla a unidades de grilla. Pasa por la matriz
 * del SVG, así funciona igual con zoom, desplazamiento o el lienzo escalado
 * por CSS.
 */
export function puntoEnPlano(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };

  const punto = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());

  return { x: punto.x / CELDA, y: punto.y / CELDA };
}

interface PlanoLienzoProps {
  children: ReactNode;
  svgRef: RefObject<SVGSVGElement | null>;
  areas?: AreaZona[];
  /** Capa extra sobre el plano (leyenda, controles propios) */
  overlay?: ReactNode;
  onFondoPointerDown?: (event: ReactPointerEvent<SVGSVGElement>) => void;
  className?: string;
}

export function PlanoLienzo({
  children,
  svgRef,
  areas = [],
  overlay,
  onFondoPointerDown,
  className,
}: PlanoLienzoProps) {
  const patronId = useId();

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const paneo = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );

  const anchoVista = ANCHO_PX / zoom;
  const altoVista = ALTO_PX / zoom;

  const limitarOffset = useCallback(
    (x: number, y: number, z: number) => ({
      x: clamp(x, 0, ANCHO_PX - ANCHO_PX / z),
      y: clamp(y, 0, ALTO_PX - ALTO_PX / z),
    }),
    [],
  );

  const aplicarZoom = (siguiente: number) => {
    const z = clamp(siguiente, ZOOM_MIN, ZOOM_MAX);

    // Mantiene el centro de la vista al acercar o alejar
    setOffset(actual => {
      const centroX = actual.x + ANCHO_PX / zoom / 2;
      const centroY = actual.y + ALTO_PX / zoom / 2;
      return limitarOffset(centroX - ANCHO_PX / z / 2, centroY - ALTO_PX / z / 2, z);
    });

    setZoom(z);
  };

  const restablecer = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    onFondoPointerDown?.(event);
    if (event.defaultPrevented || zoom === 1) return;

    paneo.current = {
      x: event.clientX,
      y: event.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!paneo.current) return;

    const svg = svgRef.current;
    if (!svg) return;

    // Los píxeles de pantalla se traducen a píxeles del plano según el zoom
    const escala = svg.getBoundingClientRect().width / anchoVista;

    setOffset(
      limitarOffset(
        paneo.current.ox - (event.clientX - paneo.current.x) / escala,
        paneo.current.oy - (event.clientY - paneo.current.y) / escala,
        zoom,
      ),
    );
  };

  const terminarPaneo = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!paneo.current) return;
    paneo.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        viewBox={`${offset.x} ${offset.y} ${anchoVista} ${altoVista}`}
        preserveAspectRatio="xMidYMid meet"
        className={cn(
          'aspect-[16/11] w-full touch-none select-none rounded-xl border border-border bg-muted/20',
          zoom > 1 && 'cursor-grab',
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={terminarPaneo}
        onPointerCancel={terminarPaneo}
      >
        <defs>
          <pattern
            id={patronId}
            width={CELDA * 4}
            height={CELDA * 4}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${CELDA * 4} 0 L 0 0 0 ${CELDA * 4}`}
              fill="none"
              className="stroke-border"
              strokeWidth={1}
              opacity={0.5}
            />
          </pattern>
        </defs>

        <rect width={ANCHO_PX} height={ALTO_PX} fill={`url(#${patronId})`} />

        {/* Áreas por zona, deducidas de dónde quedaron las mesas */}
        {areas.map(area => {
          const plano = ZONA_PLANO_CONFIG[area.zona];

          return (
            <g key={area.zona}>
              <rect
                x={area.x * CELDA}
                y={area.y * CELDA}
                width={area.ancho * CELDA}
                height={area.alto * CELDA}
                rx={16}
                className={plano.area}
                strokeWidth={1.25}
                strokeDasharray="6 5"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={area.x * CELDA + 14}
                y={area.y * CELDA + 20}
                className={cn('font-semibold uppercase', plano.etiqueta)}
                style={{ fontSize: 12, letterSpacing: '0.08em' }}
              >
                {ZONA_MESA_CONFIG[area.zona].label}
              </text>
            </g>
          );
        })}

        {children}
      </svg>

      {/* Controles de zoom */}
      <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => aplicarZoom(zoom + 0.5)}
          disabled={zoom >= ZOOM_MAX}
          title="Acercar"
          className="p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => aplicarZoom(zoom - 0.5)}
          disabled={zoom <= ZOOM_MIN}
          title="Alejar"
          className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          onClick={restablecer}
          disabled={zoom === 1 && offset.x === 0 && offset.y === 0}
          title="Ver todo el salón"
          className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <Maximize2 className="size-4" />
        </button>
      </div>

      {overlay}
    </div>
  );
}
