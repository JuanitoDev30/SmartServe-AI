'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  AlertTriangle,
  Loader2,
  Move,
  RotateCw,
  Save,
  Undo2,
  Wand2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { toast } from '@/hooks/useToast';
import {
  FORMAS_MESA,
  type FormaMesa,
  type Mesa,
  type MesaLayoutInput,
} from '@/features/mesas/schemas/mesaSchema';
import { updateLayoutMesasAction } from '@/features/mesas/actions/updateLayoutActions';

import { ZONA_MESA_CONFIG } from '../shared/constants/reservaConstants';
import { MesaPlano } from '../shared/plano/mesaPlano';
import { PlanoLienzo, puntoEnPlano } from '../shared/plano/planoLienzo';
import { FORMA_MESA_CONFIG } from '../shared/plano/planoConstants';
import {
  areasDeZona,
  colocarMesas,
  dimensionesMesa,
  limitarAlPlano,
  mesasSolapadas,
  tamanoPorDefecto,
  type MesaColocada,
} from '../shared/plano/planoGeometria';

/**
 * Todo encaja en casillas enteras, que es justo lo que guarda el backend:
 * así lo que se ve al soltar la mesa es idéntico a lo que queda guardado.
 */
const encajar = (valor: number) => Math.round(valor);

interface EditorPlanoProps {
  mesas: Mesa[];
  /** Se llama tras guardar, para que la página recargue las mesas */
  onGuardado: () => void;
}

/**
 * Editor del plano del salón: arrastra cada mesa a donde está de verdad y
 * guarda la distribución. Lo que se dibuja aquí es lo que ve la pestaña
 * "Salón" de reservas.
 */
export function EditorPlano({ mesas, onGuardado }: EditorPlanoProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [colocadas, setColocadas] = useState<MesaColocada[]>(() =>
    colocarMesas(mesas),
  );
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [arrastrandoId, setArrastrandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const arrastre = useRef<{ id: string; dx: number; dy: number } | null>(null);

  // Si las mesas cambian (alta, baja, edición), se rehace el plano
  useEffect(() => {
    setColocadas(colocarMesas(mesas));
    setSeleccion(actual =>
      actual && mesas.some(mesa => mesa.id === actual) ? actual : null,
    );
  }, [mesas]);

  const areas = useMemo(() => areasDeZona(colocadas), [colocadas]);
  const solapadas = useMemo(() => mesasSolapadas(colocadas), [colocadas]);

  // La comparación va contra las mesas que llegaron del servidor: la copia
  // local ya trae los cambios (forma incluida) y compararla consigo misma
  // dejaría el botón de guardar apagado.
  const originales = useMemo(
    () => new Map(mesas.map(mesa => [mesa.id, mesa])),
    [mesas],
  );

  const hayCambios = useMemo(
    () =>
      colocadas.some(colocada => {
        const original = originales.get(colocada.mesa.id);
        if (!original) return true;

        // Nunca se guardó: la posición actual la puso el auto-acomodo
        if (original.posX == null || original.posY == null) return true;

        const dims = dimensionesMesa(original);

        return (
          original.posX !== colocada.x ||
          original.posY !== colocada.y ||
          (original.rotacion ?? 0) !== colocada.rotacion ||
          original.forma !== colocada.mesa.forma ||
          dims.ancho !== colocada.ancho ||
          dims.alto !== colocada.alto
        );
      }),
    [colocadas, originales],
  );

  const actualizar = useCallback(
    (id: string, cambios: Partial<MesaColocada>) => {
      setColocadas(actuales =>
        actuales.map(colocada =>
          colocada.mesa.id === id
            ? { ...colocada, ...cambios, autoUbicada: false }
            : colocada,
        ),
      );
    },
    [],
  );

  const mover = useCallback(
    (id: string, x: number, y: number) => {
      setColocadas(actuales =>
        actuales.map(colocada => {
          if (colocada.mesa.id !== id) return colocada;

          const limitada = limitarAlPlano(x, y, colocada.ancho, colocada.alto);

          return { ...colocada, ...limitada, autoUbicada: false };
        }),
      );
    },
    [],
  );

  // ─────────────── arrastre ───────────────

  const iniciarArrastre = (
    event: ReactPointerEvent<SVGGElement>,
    colocada: MesaColocada,
  ) => {
    const svg = svgRef.current;
    if (!svg) return;

    // Evita que el lienzo interprete el gesto como desplazamiento
    event.preventDefault();
    event.stopPropagation();

    const punto = puntoEnPlano(svg, event.clientX, event.clientY);

    arrastre.current = {
      id: colocada.mesa.id,
      dx: colocada.x - punto.x,
      dy: colocada.y - punto.y,
    };

    setSeleccion(colocada.mesa.id);
    setArrastrandoId(colocada.mesa.id);
  };

  useEffect(() => {
    if (!arrastrandoId) return;

    const alMover = (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg || !arrastre.current) return;

      const punto = puntoEnPlano(svg, event.clientX, event.clientY);

      mover(
        arrastre.current.id,
        encajar(punto.x + arrastre.current.dx),
        encajar(punto.y + arrastre.current.dy),
      );
    };

    const alSoltar = () => {
      arrastre.current = null;
      setArrastrandoId(null);
    };

    window.addEventListener('pointermove', alMover);
    window.addEventListener('pointerup', alSoltar);
    window.addEventListener('pointercancel', alSoltar);

    return () => {
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('pointerup', alSoltar);
      window.removeEventListener('pointercancel', alSoltar);
    };
  }, [arrastrandoId, mover]);

  // Ajuste fino con el teclado
  useEffect(() => {
    if (!seleccion) return;

    const alPulsar = (event: KeyboardEvent) => {
      const destino = event.target as HTMLElement | null;
      if (destino && /^(INPUT|TEXTAREA|SELECT)$/.test(destino.tagName)) return;

      const paso = event.shiftKey ? 3 : 1;

      const delta: Record<string, [number, number]> = {
        ArrowLeft: [-paso, 0],
        ArrowRight: [paso, 0],
        ArrowUp: [0, -paso],
        ArrowDown: [0, paso],
      };

      const movimiento = delta[event.key];
      if (!movimiento) return;

      event.preventDefault();

      const actual = colocadas.find(c => c.mesa.id === seleccion);
      if (!actual) return;

      mover(seleccion, actual.x + movimiento[0], actual.y + movimiento[1]);
    };

    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [seleccion, colocadas, mover]);

  // ─────────────── acciones ───────────────

  const autoAcomodar = () => {
    setColocadas(
      colocarMesas(
        mesas.map(mesa => ({ ...mesa, posX: null, posY: null })),
      ).map(colocada => ({ ...colocada, autoUbicada: false })),
    );
    toast({
      title: 'Mesas reacomodadas',
      description: 'Se agruparon por zona. Ajusta lo que necesites y guarda.',
    });
  };

  const descartar = () => {
    setColocadas(colocarMesas(mesas));
    setSeleccion(null);
  };

  const guardar = async () => {
    setGuardando(true);

    const payload: MesaLayoutInput[] = colocadas.map(colocada => ({
      id: colocada.mesa.id,
      posX: colocada.x,
      posY: colocada.y,
      forma: colocada.mesa.forma,
      ancho: colocada.ancho,
      alto: colocada.alto,
      rotacion: colocada.rotacion,
    }));

    try {
      const resultado = await updateLayoutMesasAction({ mesas: payload });

      if (!resultado.success) {
        toast({
          variant: 'destructive',
          title: 'No se pudo guardar el plano',
          description: resultado.error,
        });
        return;
      }

      toast({
        title: 'Plano guardado',
        description: `${payload.length} mesas colocadas en el salón`,
      });
      onGuardado();
    } finally {
      setGuardando(false);
    }
  };

  const seleccionada = colocadas.find(c => c.mesa.id === seleccion);

  const cambiarForma = (forma: FormaMesa) => {
    if (!seleccionada) return;

    const base = tamanoPorDefecto({
      capacidad: seleccionada.mesa.capacidad,
      forma,
    });

    actualizar(seleccionada.mesa.id, {
      mesa: { ...seleccionada.mesa, forma },
      ancho: base.ancho,
      alto: base.alto,
    });
  };

  const redimensionar = (eje: 'ancho' | 'alto', delta: number) => {
    if (!seleccionada) return;

    const siguiente = Math.min(Math.max(seleccionada[eje] + delta, 2), 20);

    actualizar(seleccionada.mesa.id, {
      [eje]: siguiente,
      // Las redondas no tienen lados: el diámetro manda sobre los dos ejes
      ...(seleccionada.mesa.forma === 'REDONDA'
        ? { ancho: siguiente, alto: siguiente }
        : {}),
    });
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Move className="size-4" />
          Arrastra las mesas a su sitio. Las flechas del teclado afinan la
          posición.
        </p>

        <div className="flex items-center gap-2">
          {solapadas.size > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive">
              <AlertTriangle className="size-3.5" />
              {solapadas.size} mesas se pisan
            </span>
          )}

          <button
            type="button"
            onClick={autoAcomodar}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Wand2 className="size-4" />
            Auto-acomodar
          </button>

          <button
            type="button"
            onClick={descartar}
            disabled={!hayCambios || guardando}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Undo2 className="size-4" />
            Descartar
          </button>

          <button
            type="button"
            onClick={guardar}
            disabled={!hayCambios || guardando}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Guardar plano
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <PlanoLienzo
          svgRef={svgRef}
          areas={areas}
          onFondoPointerDown={() => setSeleccion(null)}
        >
          {colocadas.map(colocada => (
            <MesaPlano
              key={colocada.mesa.id}
              colocada={colocada}
              estado={colocada.mesa.activa ? 'LIBRE' : 'INACTIVA'}
              detalle={`${colocada.mesa.capacidad}p`}
              seleccionada={colocada.mesa.id === seleccion}
              alerta={solapadas.has(colocada.mesa.id)}
              arrastrando={colocada.mesa.id === arrastrandoId}
              onPointerDown={event => iniciarArrastre(event, colocada)}
            />
          ))}
        </PlanoLienzo>

        {/* Panel de la mesa seleccionada */}
        {seleccionada ? (
          <div className="space-y-4 rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Mesa {seleccionada.mesa.numero}
                </p>
                <p className="text-xs text-muted-foreground">
                  {seleccionada.mesa.capacidad} personas
                </p>
              </div>

              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                  ZONA_MESA_CONFIG[seleccionada.mesa.zona].className,
                )}
              >
                {ZONA_MESA_CONFIG[seleccionada.mesa.zona].label}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Forma
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {FORMAS_MESA.map(forma => (
                  <button
                    key={forma}
                    type="button"
                    onClick={() => cambiarForma(forma)}
                    className={cn(
                      'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
                      seleccionada.mesa.forma === forma
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40',
                    )}
                  >
                    {FORMA_MESA_CONFIG[forma].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tamaño
              </p>

              <MedidaControl
                etiqueta={
                  seleccionada.mesa.forma === 'REDONDA' ? 'Diámetro' : 'Ancho'
                }
                valor={seleccionada.ancho}
                onCambio={delta => redimensionar('ancho', delta)}
              />

              {seleccionada.mesa.forma !== 'REDONDA' && (
                <MedidaControl
                  etiqueta="Alto"
                  valor={seleccionada.alto}
                  onCambio={delta => redimensionar('alto', delta)}
                />
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                actualizar(seleccionada.mesa.id, {
                  rotacion: (seleccionada.rotacion + 45) % 360,
                })
              }
              disabled={seleccionada.mesa.forma === 'REDONDA'}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCw className="size-3.5" />
              Rotar 45° ({seleccionada.rotacion}°)
            </button>

            <p className="text-[11px] text-muted-foreground">
              Posición: {seleccionada.x} · {seleccionada.y}
            </p>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
            Toca una mesa para cambiar su forma, su tamaño o su orientación.
          </p>
        )}
      </div>
    </div>
  );
}

function MedidaControl({
  etiqueta,
  valor,
  onCambio,
}: {
  etiqueta: string;
  valor: number;
  onCambio: (delta: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-1.5">
      <span className="text-xs text-muted-foreground">{etiqueta}</span>

      <span className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onCambio(-1)}
          className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Reducir ${etiqueta.toLowerCase()}`}
        >
          −
        </button>
        <span className="w-6 text-center text-xs font-medium tabular-nums text-foreground">
          {valor}
        </span>
        <button
          type="button"
          onClick={() => onCambio(1)}
          className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Aumentar ${etiqueta.toLowerCase()}`}
        >
          +
        </button>
      </span>
    </div>
  );
}
