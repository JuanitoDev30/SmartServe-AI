'use client';

import type { PointerEvent as ReactPointerEvent } from 'react';

import { cn } from '@/lib/utils';

import { CELDA, ESTADO_MESA_CONFIG, type EstadoMesa } from './planoConstants';
import { clamp, sillasDeMesa, type MesaColocada } from './planoGeometria';

interface MesaPlanoProps {
  colocada: MesaColocada;
  estado: EstadoMesa;
  /** Línea pequeña bajo el número: hora, capacidad, lo que aplique */
  detalle?: string;
  seleccionada?: boolean;
  /** Se atenúa cuando hay un filtro activo y la mesa no encaja */
  atenuada?: boolean;
  /** Marca la mesa como mal colocada (se pisa con otra) */
  alerta?: boolean;
  arrastrando?: boolean;
  onPointerDown?: (event: ReactPointerEvent<SVGGElement>) => void;
  onClick?: () => void;
}

export function MesaPlano({
  colocada,
  estado,
  detalle,
  seleccionada = false,
  atenuada = false,
  alerta = false,
  arrastrando = false,
  onPointerDown,
  onClick,
}: MesaPlanoProps) {
  const { mesa, x, y, ancho, alto, rotacion } = colocada;
  const config = ESTADO_MESA_CONFIG[estado];

  const cx = x * CELDA;
  const cy = y * CELDA;
  const w = ancho * CELDA;
  const h = alto * CELDA;

  const sillas = sillasDeMesa(mesa.capacidad, ancho, alto, mesa.forma);
  const fuente = clamp(Math.min(w, h) * 0.34, 11, 22);

  const interactiva = Boolean(onPointerDown || onClick);

  return (
    <g
      transform={`translate(${cx} ${cy}) rotate(${rotacion})`}
      onPointerDown={onPointerDown}
      onClick={onClick}
      className={cn(
        'transition-opacity',
        interactiva && 'cursor-pointer focus:outline-none',
        onPointerDown && (arrastrando ? 'cursor-grabbing' : 'cursor-grab'),
        atenuada && 'opacity-25',
      )}
      tabIndex={interactiva ? 0 : undefined}
      role={interactiva ? 'button' : undefined}
      aria-label={`Mesa ${mesa.numero}, ${mesa.capacidad} personas, ${config.label}`}
    >
      {/* Sillas */}
      {sillas.map((silla, i) => (
        <rect
          key={i}
          x={-7}
          y={-4.5}
          width={14}
          height={9}
          rx={3}
          transform={`translate(${silla.x * CELDA} ${silla.y * CELDA}) rotate(${silla.angulo})`}
          className={cn(config.silla, 'stroke-border')}
          strokeWidth={0.75}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Superficie */}
      {mesa.forma === 'REDONDA' ? (
        <circle
          r={w / 2}
          className={cn(config.superficie, config.borde)}
          strokeWidth={1.75}
          strokeDasharray={estado === 'INACTIVA' ? '5 4' : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={7}
          className={cn(config.superficie, config.borde)}
          strokeWidth={1.75}
          strokeDasharray={estado === 'INACTIVA' ? '5 4' : undefined}
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* Anillos del editor: selección y aviso de mesas que se pisan */}
      {(seleccionada || alerta) &&
        (mesa.forma === 'REDONDA' ? (
          <circle
            r={w / 2 + 6}
            className={cn(
              'fill-none',
              alerta ? 'stroke-destructive' : 'stroke-primary',
            )}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <rect
            x={-w / 2 - 6}
            y={-h / 2 - 6}
            width={w + 12}
            height={h + 12}
            rx={10}
            className={cn(
              'fill-none',
              alerta ? 'stroke-destructive' : 'stroke-primary',
            )}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          />
        ))}

      {/* El texto se contra-rota para que nunca quede de lado */}
      <g transform={`rotate(${-rotacion})`} className="pointer-events-none">
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          y={detalle ? -fuente * 0.35 : 0}
          className={cn('font-semibold', config.texto)}
          style={{ fontSize: fuente }}
        >
          {mesa.numero}
        </text>

        {detalle && (
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            y={fuente * 0.7}
            className="fill-muted-foreground"
            style={{ fontSize: Math.max(fuente * 0.55, 9) }}
          >
            {detalle}
          </text>
        )}
      </g>
    </g>
  );
}
