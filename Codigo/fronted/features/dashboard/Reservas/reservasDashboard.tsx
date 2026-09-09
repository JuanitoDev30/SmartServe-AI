'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Search,
  Users,
  UtensilsCrossed,
  XCircle,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { TabsSelector } from '@/components/ui/tabSelector';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/useToast';
import { useReservasStore } from '@/store/reservasStore';

import type { Mesa } from '@/features/mesas/schemas/mesaSchema';
import type {
  CreateReservaInput,
  EstadoReserva,
  Reserva,
  ReservaStats,
  UpdateReservaInput,
} from '@/features/reservas/schemas/reservaSchema';
import type { ReservaFormValues } from '@/lib/validations/reserva';
import {
  getAgendaAction,
  getReservaStatsAction,
} from '@/features/reservas/actions/getReservasActions';
import { createReservaAction } from '@/features/reservas/actions/createReservaActions';
import {
  cambiarEstadoReservaAction,
  updateReservaAction,
} from '@/features/reservas/actions/updateReservaActions';
import { deleteReservaAction } from '@/features/reservas/actions/deleteReservaActions';
import { ESTADOS_CERRADOS } from '@/features/reservas/utils/transiciones';
import {
  combinarFechaHora,
  esHoy,
  formatFechaLarga,
  sumarDias,
  toInputDate,
} from '@/features/reservas/utils/fechas';
import {
  RESERVA_TAB_FILTERS,
  type ReservaTabFilter,
} from '../shared/constants/reservaConstants';

import { ReservasAgenda } from './reservasAgenda';
import { ReservasTable } from './reservasTable';
import { MapaMesas } from './mapaMesas';
import { ReservaFormModal } from './reservaFormModal';
import { ReservaViewModal } from './reservaViewModal';
import { DeleteReservaConfirm } from './deleteReservaConfirm';

type Vista = 'agenda' | 'lista' | 'mesas';

const VISTAS: { value: Vista; label: string; icon: typeof List }[] = [
  { value: 'agenda', label: 'Agenda', icon: CalendarRange },
  { value: 'lista', label: 'Lista', icon: List },
  { value: 'mesas', label: 'Salón', icon: LayoutGrid },
];

interface StatCardProps {
  titulo: string;
  valor: string | number;
  detalle: string;
  icon: typeof CalendarDays;
  iconClassName: string;
}

function StatCard({
  titulo,
  valor,
  detalle,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className="text-3xl font-semibold text-foreground">{valor}</p>
          <p className="text-sm text-muted-foreground">{detalle}</p>
        </div>
        <div className={cn('rounded-full p-3', iconClassName)}>
          <Icon className="size-5 text-white" />
        </div>
      </div>
    </div>
  );
}

interface ReservasDashboardProps {
  mesas: Mesa[];
}

export function ReservasDashboard({ mesas }: ReservasDashboardProps) {
  const reservas = useReservasStore(state => state.reservas);
  const isLoading = useReservasStore(state => state.isLoading);
  const setReservas = useReservasStore(state => state.setReservas);
  const setIsLoading = useReservasStore(state => state.setIsLoading);
  const agregarReserva = useReservasStore(state => state.agregarReserva);
  const actualizarReserva = useReservasStore(state => state.actualizarReserva);
  const eliminarReserva = useReservasStore(state => state.eliminarReserva);

  const [fecha, setFecha] = useState(() => toInputDate());
  const [vista, setVista] = useState<Vista>('agenda');
  const [activeTab, setActiveTab] = useState<ReservaTabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<ReservaStats | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] =
    useState<Reserva | null>(null);
  const [reservaEnEdicion, setReservaEnEdicion] = useState<Reserva | null>(
    null,
  );
  const [mesaPreseleccionada, setMesaPreseleccionada] = useState<Mesa | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // La agenda del día es la fuente de la lista; el socket la mantiene viva
  const cargarAgenda = useCallback(
    async (dia: string) => {
      setIsLoading(true);
      const resultado = await getAgendaAction(dia);

      if (!resultado.success) {
        toast({
          variant: 'destructive',
          title: 'No se pudo cargar la agenda',
          description: resultado.error,
        });
      }

      setReservas(resultado.data ?? []);
      setIsLoading(false);
    },
    [setIsLoading, setReservas],
  );

  useEffect(() => {
    cargarAgenda(fecha);
  }, [fecha, cargarAgenda]);

  const refrescarStats = useCallback(async () => {
    const resultado = await getReservaStatsAction();
    if (resultado.success && resultado.data) setStats(resultado.data);
  }, []);

  useEffect(() => {
    refrescarStats();
  }, [refrescarStats]);

  // Las reservas del store pueden incluir otros días (llegan por socket)
  const reservasDelDia = useMemo(
    () =>
      reservas.filter(reserva => toInputDate(new Date(reserva.fechaHora)) === fecha),
    [reservas, fecha],
  );

  const reservasFiltradas = useMemo(() => {
    let resultado = reservasDelDia;

    if (activeTab !== 'all') {
      resultado = resultado.filter(reserva => reserva.estado === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      resultado = resultado.filter(
        reserva =>
          reserva.cliente.nombre.toLowerCase().includes(query) ||
          reserva.cliente.telefono.includes(query) ||
          `${reserva.mesa.numero}`.includes(query),
      );
    }

    return resultado;
  }, [reservasDelDia, activeTab, searchQuery]);

  const resumenDia = useMemo(() => {
    const vigentes = reservasDelDia.filter(
      reserva => !ESTADOS_CERRADOS.includes(reserva.estado),
    );

    const mesasActivas = mesas.filter(mesa => mesa.activa).length;
    const mesasOcupadas = new Set(vigentes.map(reserva => reserva.mesa.id))
      .size;

    return {
      total: reservasDelDia.length,
      pendientes: reservasDelDia.filter(r => r.estado === 'PENDIENTE').length,
      confirmadas: reservasDelDia.filter(r => r.estado === 'CONFIRMADA').length,
      enMesa: reservasDelDia.filter(r => r.estado === 'SENTADA').length,
      comensales: vigentes.reduce(
        (suma, reserva) => suma + reserva.numeroPersonas,
        0,
      ),
      canceladas: reservasDelDia.filter(r => r.estado === 'CANCELADA').length,
      noAsistio: reservasDelDia.filter(r => r.estado === 'NO_ASISTIO').length,
      mesasOcupadas,
      mesasActivas,
      ocupacion: mesasActivas
        ? Math.round((mesasOcupadas / mesasActivas) * 100)
        : 0,
    };
  }, [reservasDelDia, mesas]);

  // ─────────────── handlers ───────────────

  const abrirCreacion = (mesa?: Mesa) => {
    setReservaEnEdicion(null);
    setMesaPreseleccionada(mesa ?? null);
    setFormError(null);
    setFormOpen(true);
  };

  const abrirEdicion = (reserva: Reserva) => {
    setReservaEnEdicion(reserva);
    setMesaPreseleccionada(null);
    setFormError(null);
    setViewOpen(false);
    setFormOpen(true);
  };

  const abrirDetalle = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setViewOpen(true);
  };

  const handleSubmit = async (values: ReservaFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    const fechaHora = combinarFechaHora(values.fecha, values.hora);
    const email = values.cliente.email?.trim();

    try {
      if (reservaEnEdicion) {
        const dto: UpdateReservaInput = {
          fechaHora,
          duracionMinutos: values.duracionMinutos,
          numeroPersonas: values.numeroPersonas,
          mesaId: values.mesaId,
          notas: values.notas?.trim() || undefined,
          cliente: {
            nombre: values.cliente.nombre.trim(),
            telefono: values.cliente.telefono,
            email: email || undefined,
          },
        };

        const resultado = await updateReservaAction(reservaEnEdicion.id, dto);

        if (!resultado.success || !resultado.data) {
          setFormError(resultado.error ?? null);
          toast({
            variant: 'destructive',
            title: 'No se pudo actualizar la reserva',
            description: resultado.error,
          });
          return;
        }

        actualizarReserva(resultado.data);
        toast({
          title: 'Reserva actualizada',
          description: 'Los cambios se guardaron correctamente',
        });
      } else {
        const dto: CreateReservaInput = {
          fechaHora,
          duracionMinutos: values.duracionMinutos,
          numeroPersonas: values.numeroPersonas,
          mesaId: values.mesaId,
          notas: values.notas?.trim() || undefined,
          ...(values.modoCliente === 'existente'
            ? { clienteId: values.clienteId }
            : {
                cliente: {
                  nombre: values.cliente.nombre.trim(),
                  telefono: values.cliente.telefono,
                  email: email || undefined,
                },
              }),
        };

        const resultado = await createReservaAction(dto);

        if (!resultado.success || !resultado.data) {
          setFormError(resultado.error ?? null);
          toast({
            variant: 'destructive',
            title: 'No se pudo crear la reserva',
            description: resultado.error,
          });
          return;
        }

        agregarReserva(resultado.data);
        toast({
          title: 'Reserva creada',
          description: `Mesa ${resultado.data.mesa.numero} para ${resultado.data.numeroPersonas} personas`,
        });

        // Si se agendó para otro día, mover la agenda hasta ahí
        const diaCreado = toInputDate(new Date(resultado.data.fechaHora));
        if (diaCreado !== fecha) setFecha(diaCreado);
      }

      setFormOpen(false);
      setReservaEnEdicion(null);
      setMesaPreseleccionada(null);
      refrescarStats();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCambiarEstado = async (
    reserva: Reserva,
    estado: EstadoReserva,
    motivoCancelacion?: string,
  ) => {
    setIsSubmitting(true);

    try {
      const resultado = await cambiarEstadoReservaAction(
        reserva.id,
        estado,
        motivoCancelacion,
      );

      if (!resultado.success || !resultado.data) {
        toast({
          variant: 'destructive',
          title: 'No se pudo cambiar el estado',
          description: resultado.error,
        });
        return;
      }

      actualizarReserva(resultado.data);
      setReservaSeleccionada(resultado.data);
      toast({
        title: 'Estado actualizado',
        description: `La reserva de ${reserva.cliente.nombre} ahora está ${estado.toLowerCase()}`,
      });
      refrescarStats();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!reservaSeleccionada) return;

    setIsSubmitting(true);

    try {
      const resultado = await deleteReservaAction(reservaSeleccionada.id);

      if (!resultado.success) {
        toast({
          variant: 'destructive',
          title: 'No se pudo eliminar la reserva',
          description: resultado.error,
        });
        return;
      }

      eliminarReserva(reservaSeleccionada.id);
      toast({
        title: 'Reserva eliminada',
        description: 'La reserva se eliminó del sistema',
      });
      setDeleteOpen(false);
      setViewOpen(false);
      setReservaSeleccionada(null);
      refrescarStats();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Gestión de Reservas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Organiza el salón y controla la ocupación en tiempo real
          </p>
        </div>

        <button
          onClick={() => abrirCreacion()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nueva reserva
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          titulo="Reservas del día"
          valor={resumenDia.total}
          detalle={`${resumenDia.confirmadas} confirmadas · ${resumenDia.pendientes} pendientes`}
          icon={CalendarDays}
          iconClassName="bg-primary"
        />
        <StatCard
          titulo="Comensales"
          valor={resumenDia.comensales}
          detalle={`${resumenDia.enMesa} en mesa ahora`}
          icon={Users}
          iconClassName="bg-blue-500"
        />
        <StatCard
          titulo="Ocupación"
          valor={`${resumenDia.ocupacion}%`}
          detalle={`${resumenDia.mesasOcupadas} de ${resumenDia.mesasActivas} mesas`}
          icon={UtensilsCrossed}
          iconClassName="bg-amber-500"
        />
        <StatCard
          titulo="Canceladas"
          valor={resumenDia.canceladas + resumenDia.noAsistio}
          detalle={
            stats
              ? `${stats.mes.canceladas} este mes (${stats.mes.variacionCanceladas >= 0 ? '+' : ''}${stats.mes.variacionCanceladas}%)`
              : `${resumenDia.noAsistio} no asistieron`
          }
          icon={XCircle}
          iconClassName="bg-red-500"
        />
      </div>

      {/* Panel principal */}
      <div className="rounded-xl border border-border bg-card">
        {/* Barra de día + vistas */}
        <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFecha(sumarDias(fecha, -1))}
              className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              aria-label="Día anterior"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="relative">
              <Input
                type="date"
                value={fecha}
                onChange={event => setFecha(event.target.value)}
                className="w-[10.5rem]"
              />
            </div>

            <button
              onClick={() => setFecha(sumarDias(fecha, 1))}
              className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              aria-label="Día siguiente"
            >
              <ChevronRight className="size-4" />
            </button>

            <button
              onClick={() => setFecha(toInputDate())}
              disabled={esHoy(fecha)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                esHoy(fecha)
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              Hoy
            </button>

            <span className="ml-1 hidden text-sm capitalize text-muted-foreground xl:inline">
              {formatFechaLarga(fecha)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cliente, teléfono o mesa..."
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                className="w-full pl-9 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/50 p-1">
              {VISTAS.map(opcion => (
                <button
                  key={opcion.value}
                  onClick={() => setVista(opcion.value)}
                  title={opcion.label}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    vista === opcion.value
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <opcion.icon className="size-4" />
                  <span className="hidden sm:inline">{opcion.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filtros por estado */}
        {vista !== 'mesas' && (
          <div className="p-4">
            <TabsSelector
              tabs={RESERVA_TAB_FILTERS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        )}

        {/* Contenido */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-16 text-muted-foreground">
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Cargando reservas...
          </div>
        ) : vista === 'agenda' ? (
          <ReservasAgenda
            reservas={reservasFiltradas}
            onSelect={abrirDetalle}
          />
        ) : vista === 'lista' ? (
          <ReservasTable
            reservas={reservasFiltradas}
            isLoading={false}
            onView={abrirDetalle}
            onEdit={abrirEdicion}
          />
        ) : (
          <MapaMesas
            mesas={mesas}
            reservas={reservasDelDia}
            onSelectReserva={abrirDetalle}
            onCrearEnMesa={abrirCreacion}
          />
        )}
      </div>

      {/* Modales */}
      <ReservaFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setReservaEnEdicion(null);
          setMesaPreseleccionada(null);
        }}
        onSubmit={handleSubmit}
        reserva={reservaEnEdicion}
        mesaPreseleccionada={mesaPreseleccionada}
        fechaPorDefecto={fecha}
        isLoading={isSubmitting}
        error={formError}
      />

      <ReservaViewModal
        isOpen={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setReservaSeleccionada(null);
        }}
        reserva={reservaSeleccionada}
        onCambiarEstado={handleCambiarEstado}
        onEdit={abrirEdicion}
        onDelete={() => setDeleteOpen(true)}
        isSubmitting={isSubmitting}
      />

      <DeleteReservaConfirm
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        reserva={reservaSeleccionada}
        isLoading={isSubmitting}
      />
    </div>
  );
}
