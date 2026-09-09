'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarDays,
  Check,
  Clock,
  FileText,
  Loader2,
  Minus,
  Plus,
  Save,
  Search,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import {
  reservaFormSchema,
  type ReservaFormValues,
  duracionOptions,
} from '@/lib/validations/reserva';
import type {
  MesaDisponibilidad,
  Reserva,
} from '@/features/reservas/schemas/reservaSchema';
import type { Mesa } from '@/features/mesas/schemas/mesaSchema';
import type { Cliente } from '@/features/clientes/schemas/clientSchema';
import { getDisponibilidadAction } from '@/features/reservas/actions/getDisponibilidadActions';
import { searchClientesAction } from '@/features/clientes/actions/searchClientsActions';
import {
  combinarFechaHora,
  esFechaHoraValida,
  formatDuracion,
  toInputDate,
} from '@/features/reservas/utils/fechas';
import {
  HORAS_SUGERIDAS,
  ZONA_MESA_CONFIG,
} from '../shared/constants/reservaConstants';

interface ReservaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ReservaFormValues) => void;
  reserva: Reserva | null;
  mesaPreseleccionada?: Mesa | null;
  fechaPorDefecto: string;
  isLoading: boolean;
  error?: string | null;
}

const valoresIniciales = (fecha: string): ReservaFormValues => ({
  modoCliente: 'existente',
  clienteId: undefined,
  cliente: { nombre: '', telefono: '', email: '' },
  mesaId: undefined,
  fecha,
  hora: '20:00',
  duracionMinutos: 90,
  numeroPersonas: 2,
  notas: '',
});

export function ReservaFormModal({
  isOpen,
  onClose,
  onSubmit,
  reserva,
  mesaPreseleccionada,
  fechaPorDefecto,
  isLoading,
  error,
}: ReservaFormModalProps) {
  const esEdicion = Boolean(reserva);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaFormSchema),
    defaultValues: valoresIniciales(fechaPorDefecto),
  });

  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [buscandoClientes, setBuscandoClientes] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  const [disponibilidad, setDisponibilidad] = useState<
    MesaDisponibilidad[] | null
  >(null);
  const [cargandoMesas, setCargandoMesas] = useState(false);

  const modoCliente = useWatch({ control, name: 'modoCliente' });
  const fecha = useWatch({ control, name: 'fecha' });
  const hora = useWatch({ control, name: 'hora' });
  const duracionMinutos = useWatch({ control, name: 'duracionMinutos' });
  const numeroPersonas = useWatch({ control, name: 'numeroPersonas' });
  const mesaId = useWatch({ control, name: 'mesaId' });

  const busquedaDebounced = useDebounce(busquedaCliente, 350);
  const franja = useDebounce(
    `${fecha}|${hora}|${duracionMinutos}|${numeroPersonas}`,
    350,
  );

  // Precargar el formulario al abrirlo (edición, mesa preseleccionada o alta)
  useEffect(() => {
    if (!isOpen) return;

    if (reserva) {
      const inicio = new Date(reserva.fechaHora);

      reset({
        modoCliente: 'nuevo',
        clienteId: reserva.cliente.id,
        cliente: {
          nombre: reserva.cliente.nombre,
          telefono: reserva.cliente.telefono,
          email: reserva.cliente.email ?? '',
        },
        mesaId: reserva.mesa.id,
        fecha: toInputDate(inicio),
        hora: inicio.toTimeString().slice(0, 5),
        duracionMinutos: reserva.duracionMinutos,
        numeroPersonas: reserva.numeroPersonas,
        notas: reserva.notas ?? '',
      });
      setClienteSeleccionado(null);
    } else {
      reset({
        ...valoresIniciales(fechaPorDefecto),
        mesaId: mesaPreseleccionada?.id,
      });
      setClienteSeleccionado(null);
      setBusquedaCliente('');
      setClientes([]);
    }
  }, [isOpen, reserva, mesaPreseleccionada, fechaPorDefecto, reset]);

  // Búsqueda de clientes existentes
  useEffect(() => {
    if (!isOpen || modoCliente !== 'existente') return;

    let cancelado = false;

    const buscar = async () => {
      setBuscandoClientes(true);
      const resultado = await searchClientesAction(busquedaDebounced);
      if (cancelado) return;
      setClientes(resultado.data ?? []);
      setBuscandoClientes(false);
    };

    buscar();

    return () => {
      cancelado = true;
    };
  }, [isOpen, modoCliente, busquedaDebounced]);

  // Disponibilidad real de mesas para la franja elegida
  useEffect(() => {
    if (!isOpen || !numeroPersonas || !esFechaHoraValida(fecha, hora)) return;

    let cancelado = false;

    const consultar = async () => {
      setCargandoMesas(true);

      const resultado = await getDisponibilidadAction({
        fechaHora: combinarFechaHora(fecha, hora),
        duracionMinutos,
        numeroPersonas,
        excluirReservaId: reserva?.id,
      });

      if (cancelado) return;

      setDisponibilidad(resultado.success ? (resultado.data?.mesas ?? []) : []);
      setCargandoMesas(false);
    };

    consultar();

    return () => {
      cancelado = true;
    };
    // `franja` agrupa los campos que cambian la disponibilidad
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, franja, reserva?.id]);

  // Si la mesa elegida deja de estar disponible, se vuelve a automática
  useEffect(() => {
    if (!mesaId || !disponibilidad) return;

    const elegida = disponibilidad.find(item => item.mesa.id === mesaId);
    if (elegida && !elegida.disponible) setValue('mesaId', undefined);
  }, [mesaId, disponibilidad, setValue]);

  const seleccionarCliente = useCallback(
    (cliente: Cliente) => {
      setClienteSeleccionado(cliente);
      setValue('clienteId', cliente.id, { shouldValidate: true });
    },
    [setValue],
  );

  const mesasDisponibles = useMemo(
    () => (disponibilidad ?? []).filter(item => item.disponible).length,
    [disponibilidad],
  );

  if (!isOpen) return null;

  const ajustarPersonas = (delta: number) => {
    const siguiente = Math.min(50, Math.max(1, (numeroPersonas || 1) + delta));
    setValue('numeroPersonas', siguiente, { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {esEdicion ? 'Editar reserva' : 'Nueva reserva'}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {esEdicion
                ? 'Cambia el horario, la mesa o los datos del cliente'
                : 'Reserva una mesa para tus comensales'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ───────── Cliente ───────── */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <User className="size-4" />
                <h3 className="font-medium">Cliente</h3>
              </div>

              {!esEdicion && (
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-1">
                  {(
                    [
                      { value: 'existente', label: 'Cliente existente' },
                      { value: 'nuevo', label: 'Cliente nuevo' },
                    ] as const
                  ).map(opcion => (
                    <button
                      key={opcion.value}
                      type="button"
                      onClick={() => setValue('modoCliente', opcion.value)}
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        modoCliente === opcion.value
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {opcion.label}
                    </button>
                  ))}
                </div>
              )}

              {modoCliente === 'existente' && !esEdicion ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={busquedaCliente}
                      onChange={event =>
                        setBusquedaCliente(event.target.value)
                      }
                      placeholder="Buscar por nombre o teléfono..."
                      className="pl-9"
                    />
                  </div>

                  {clienteSeleccionado && (
                    <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {clienteSeleccionado.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {clienteSeleccionado.telefono}
                        </p>
                      </div>
                      <Check className="size-4 shrink-0 text-primary" />
                    </div>
                  )}

                  <div className="max-h-52 space-y-1 overflow-y-auto rounded-xl border border-border p-1">
                    {buscandoClientes ? (
                      <p className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Buscando...
                      </p>
                    ) : clientes.length === 0 ? (
                      <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                        Sin resultados. Registra al cliente como nuevo.
                      </p>
                    ) : (
                      clientes.map(cliente => (
                        <button
                          key={cliente.id}
                          type="button"
                          onClick={() => seleccionarCliente(cliente)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted',
                            clienteSeleccionado?.id === cliente.id &&
                              'bg-muted',
                          )}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-foreground">
                              {cliente.nombre}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {cliente.telefono}
                            </span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  {errors.clienteId && (
                    <p className="text-sm text-destructive">
                      {errors.clienteId.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nombre
                    </label>
                    <Input
                      {...register('cliente.nombre')}
                      placeholder="Nombre del cliente"
                      className={cn(
                        errors.cliente?.nombre &&
                          'border-destructive focus-visible:ring-destructive',
                      )}
                    />
                    {errors.cliente?.nombre && (
                      <p className="text-sm text-destructive">
                        {errors.cliente.nombre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      maxLength={10}
                      placeholder="3001234567"
                      {...register('cliente.telefono', {
                        onChange: event => {
                          event.target.value = event.target.value.replace(
                            /\D/g,
                            '',
                          );
                        },
                      })}
                      className={cn(
                        errors.cliente?.telefono &&
                          'border-destructive focus-visible:ring-destructive',
                      )}
                    />
                    {errors.cliente?.telefono ? (
                      <p className="text-sm text-destructive">
                        {errors.cliente.telefono.message}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        10 dígitos, sin espacios ni guiones.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email (opcional)
                    </label>
                    <Input
                      {...register('cliente.email')}
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      className={cn(
                        errors.cliente?.email &&
                          'border-destructive focus-visible:ring-destructive',
                      )}
                    />
                    {errors.cliente?.email && (
                      <p className="text-sm text-destructive">
                        {errors.cliente.email.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* ───────── Horario ───────── */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <CalendarDays className="size-4" />
                <h3 className="font-medium">Fecha y horario</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Fecha
                  </label>
                  <Input type="date" {...register('fecha')} />
                  {errors.fecha && (
                    <p className="text-sm text-destructive">
                      {errors.fecha.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Hora
                  </label>
                  <Input type="time" {...register('hora')} />
                  {errors.hora && (
                    <p className="text-sm text-destructive">
                      {errors.hora.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {HORAS_SUGERIDAS.map(sugerida => (
                  <button
                    key={sugerida}
                    type="button"
                    onClick={() =>
                      setValue('hora', sugerida, { shouldValidate: true })
                    }
                    className={cn(
                      'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                      hora === sugerida
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                    )}
                  >
                    {sugerida}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Duración
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {duracionOptions.map(opcion => (
                    <button
                      key={opcion.value}
                      type="button"
                      onClick={() =>
                        setValue('duracionMinutos', opcion.value, {
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        'rounded-lg border px-2 py-2 text-sm font-medium transition-colors',
                        duracionMinutos === opcion.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40',
                      )}
                    >
                      {opcion.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Users className="size-4" />
                  Personas
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => ajustarPersonas(-1)}
                    className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    aria-label="Quitar una persona"
                  >
                    <Minus className="size-4" />
                  </button>

                  <Input
                    type="number"
                    min={1}
                    max={50}
                    className="w-20 text-center"
                    {...register('numeroPersonas', { valueAsNumber: true })}
                  />

                  <button
                    type="button"
                    onClick={() => ajustarPersonas(1)}
                    className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    aria-label="Añadir una persona"
                  >
                    <Plus className="size-4" />
                  </button>

                  <span className="text-xs text-muted-foreground">
                    {formatDuracion(duracionMinutos)} de mesa
                  </span>
                </div>
                {errors.numeroPersonas && (
                  <p className="text-sm text-destructive">
                    {errors.numeroPersonas.message}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* ───────── Mesa ───────── */}
          <section className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground">
                <Sparkles className="size-4" />
                <h3 className="font-medium">Mesa</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {cargandoMesas
                  ? 'Consultando disponibilidad...'
                  : `${mesasDisponibles} disponibles en esa franja`}
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              <button
                type="button"
                onClick={() => setValue('mesaId', undefined)}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-colors',
                  !mesaId
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40',
                )}
              >
                <span className="text-sm font-medium text-foreground">
                  Automática
                </span>
                <span className="text-xs text-muted-foreground">
                  La mesa libre más ajustada
                </span>
              </button>

              {(disponibilidad ?? []).map(({ mesa, disponible, motivo }) => {
                const zona = ZONA_MESA_CONFIG[mesa.zona];
                const seleccionada = mesaId === mesa.id;

                return (
                  <button
                    key={mesa.id}
                    type="button"
                    disabled={!disponible}
                    title={motivo ?? undefined}
                    onClick={() => setValue('mesaId', mesa.id)}
                    className={cn(
                      'flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-colors',
                      seleccionada
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40',
                      !disponible &&
                        'cursor-not-allowed opacity-50 hover:border-border',
                    )}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Mesa {mesa.numero}
                      </span>
                      <span
                        className={cn(
                          'rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
                          zona.className,
                        )}
                      >
                        {zona.label}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {motivo ?? `Hasta ${mesa.capacidad} personas`}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ───────── Notas ───────── */}
          <section className="mt-6 space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="size-4" />
              Notas (opcional)
            </label>
            <textarea
              {...register('notas')}
              rows={2}
              placeholder="Alergias, celebración, preferencia de zona..."
              className={cn(
                'flex w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            />
            {errors.notas && (
              <p className="text-sm text-destructive">{errors.notas.message}</p>
            )}
          </section>

          {error && (
            <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Acciones */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
                'transition-colors hover:bg-primary/90',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  {esEdicion ? (
                    <Save className="size-4" />
                  ) : (
                    <Clock className="size-4" />
                  )}
                  {esEdicion ? 'Guardar cambios' : 'Crear reserva'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
