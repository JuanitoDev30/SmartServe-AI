'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Armchair,
  CircleSlash,
  LayoutGrid,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  Users,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { TabsSelector } from '@/components/ui/tabSelector';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/useToast';

import {
  ZONAS_MESA,
  type Mesa,
  type ZonaMesa,
} from '@/features/mesas/schemas/mesaSchema';
import type { MesaFormValues } from '@/lib/validations/mesa';
import { createMesaAction } from '@/features/mesas/actions/createMesaActions';
import {
  cambiarDisponibilidadMesaAction,
  updateMesaAction,
} from '@/features/mesas/actions/updateMesaActions';
import { deleteMesaAction } from '@/features/mesas/actions/deleteMesaActions';
import { ZONA_MESA_CONFIG } from '../shared/constants/reservaConstants';
import { StatsCard } from '../shared/statsCard';
import { MesaFormModal } from './mesaFormModal';
import { DeleteMesaConfirm } from './deleteMesaConfirm';

type ZonaFilter = 'all' | ZonaMesa;

const ZONA_TABS: { label: string; value: ZonaFilter }[] = [
  { label: 'Todas', value: 'all' },
  ...ZONAS_MESA.map(zona => ({
    label: ZONA_MESA_CONFIG[zona].label,
    value: zona as ZonaFilter,
  })),
];

interface MesasDashboardProps {
  mesas: Mesa[];
}

export function MesasDashboard({ mesas }: MesasDashboardProps) {
  const router = useRouter();

  const [zonaActiva, setZonaActiva] = useState<ZonaFilter>('all');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resumen = useMemo(() => {
    const activas = mesas.filter(mesa => mesa.activa);

    return {
      total: mesas.length,
      activas: activas.length,
      inactivas: mesas.length - activas.length,
      capacidad: activas.reduce((suma, mesa) => suma + mesa.capacidad, 0),
    };
  }, [mesas]);

  const mesasFiltradas = useMemo(() => {
    let resultado = mesas;

    if (zonaActiva !== 'all') {
      resultado = resultado.filter(mesa => mesa.zona === zonaActiva);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      resultado = resultado.filter(
        mesa =>
          `${mesa.numero}`.includes(query) ||
          mesa.descripcion?.toLowerCase().includes(query),
      );
    }

    return [...resultado].sort((a, b) => a.numero - b.numero);
  }, [mesas, zonaActiva, search]);

  const abrirCreacion = () => {
    setMesaSeleccionada(null);
    setFormError(null);
    setFormOpen(true);
  };

  const abrirEdicion = (mesa: Mesa) => {
    setMesaSeleccionada(mesa);
    setFormError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (values: MesaFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    const dto = {
      ...values,
      descripcion: values.descripcion?.trim() || undefined,
    };

    try {
      const resultado = mesaSeleccionada
        ? await updateMesaAction(mesaSeleccionada.id, dto)
        : await createMesaAction(dto);

      if (!resultado.success) {
        setFormError(resultado.error ?? null);
        toast({
          variant: 'destructive',
          title: mesaSeleccionada
            ? 'No se pudo actualizar la mesa'
            : 'No se pudo crear la mesa',
          description: resultado.error,
        });
        return;
      }

      toast({
        title: mesaSeleccionada ? 'Mesa actualizada' : 'Mesa creada',
        description: `Mesa ${values.numero} · ${values.capacidad} personas`,
      });

      setFormOpen(false);
      setMesaSeleccionada(null);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisponibilidad = async (mesa: Mesa) => {
    const resultado = await cambiarDisponibilidadMesaAction(
      mesa.id,
      !mesa.activa,
    );

    if (!resultado.success) {
      toast({
        variant: 'destructive',
        title: 'No se pudo cambiar la disponibilidad',
        description: resultado.error,
      });
      return;
    }

    toast({
      title: mesa.activa ? 'Mesa fuera de servicio' : 'Mesa disponible',
      description: `Mesa ${mesa.numero} actualizada`,
    });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!mesaSeleccionada) return;

    setIsSubmitting(true);

    try {
      const resultado = await deleteMesaAction(mesaSeleccionada.id);

      if (!resultado.success) {
        toast({
          variant: 'destructive',
          title: 'No se pudo eliminar la mesa',
          description: resultado.error,
        });
        return;
      }

      toast({
        title: 'Mesa eliminada',
        description: `La mesa ${mesaSeleccionada.numero} se eliminó`,
      });

      setDeleteOpen(false);
      setMesaSeleccionada(null);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Mesas del salón
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configura las mesas disponibles para reservar
          </p>
        </div>

        <button
          onClick={abrirCreacion}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nueva mesa
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard titulo="Mesas" valor={`${resumen.total}`} icon={LayoutGrid} />
        <StatsCard
          titulo="En servicio"
          valor={`${resumen.activas}`}
          icon={Armchair}
        />
        <StatsCard
          titulo="Capacidad total"
          valor={`${resumen.capacidad}`}
          descripcion="comensales simultáneos"
          icon={Users}
        />
        <StatsCard
          titulo="Fuera de servicio"
          valor={`${resumen.inactivas}`}
          icon={CircleSlash}
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsSelector
            tabs={ZONA_TABS}
            activeTab={zonaActiva}
            onTabChange={setZonaActiva}
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar mesa..."
              value={search}
              onChange={event => setSearch(event.target.value)}
              className="w-full pl-9 sm:w-56"
            />
          </div>
        </div>

        {mesasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center gap-2 border-t border-border px-4 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-muted">
              <LayoutGrid className="size-6 text-muted-foreground" />
            </span>
            <p className="text-sm font-medium text-foreground">
              No hay mesas que coincidan
            </p>
            <p className="text-sm text-muted-foreground">
              Crea una mesa nueva o cambia los filtros.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mesasFiltradas.map(mesa => {
              const zona = ZONA_MESA_CONFIG[mesa.zona];

              return (
                <div
                  key={mesa.id}
                  className={cn(
                    'flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40',
                    !mesa.activa && 'opacity-60',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                        {mesa.numero}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          Mesa {mesa.numero}
                        </p>
                        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="size-3.5" />
                          {mesa.capacidad} personas
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                        zona.className,
                      )}
                    >
                      {zona.label}
                    </span>
                  </div>

                  {mesa.descripcion && (
                    <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                      {mesa.descripcion}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium',
                        mesa.activa
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-muted-foreground',
                      )}
                    >
                      <span
                        className={cn(
                          'size-1.5 rounded-full',
                          mesa.activa ? 'bg-emerald-500' : 'bg-muted-foreground',
                        )}
                      />
                      {mesa.activa ? 'En servicio' : 'Fuera de servicio'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDisponibilidad(mesa)}
                        title={
                          mesa.activa
                            ? 'Poner fuera de servicio'
                            : 'Poner en servicio'
                        }
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Power className="size-4" />
                      </button>
                      <button
                        onClick={() => abrirEdicion(mesa)}
                        title="Editar"
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          setMesaSeleccionada(mesa);
                          setDeleteOpen(true);
                        }}
                        title="Eliminar"
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MesaFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setMesaSeleccionada(null);
        }}
        onSubmit={handleSubmit}
        mesa={mesaSeleccionada}
        isLoading={isSubmitting}
        error={formError}
      />

      <DeleteMesaConfirm
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        mesa={mesaSeleccionada}
        isLoading={isSubmitting}
      />
    </div>
  );
}
