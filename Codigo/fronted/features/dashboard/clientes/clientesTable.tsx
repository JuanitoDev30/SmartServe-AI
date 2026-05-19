'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Eye,
  Edit,
  ShoppingBag,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropDownMenu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type Cliente,
  type ClienteStats,
  type PaginatedClientes,
  type ClienteFilters,
  type EstadoCliente,
  UpdateClienteInput,
} from '@/features/clientes/schemas/clientSchema';
import { updateClientAction } from '@/features/clientes/actions/updateClientActions';
import { ClienteEditModal } from './clientesEditModal';
import { ClienteDetailModal } from './clientesDetailModal';
import { ClientePedidosModal } from './clientesPedidosModal';

import { formatDate } from '@/lib/utils/formatters';
import { ESTADO_CLIENTE_CONFIG } from '../shared/constants/pedidoConstants';

interface ClientesTableProps {
  initialData: PaginatedClientes | null;
  initialStats: ClienteStats | null;
  initialFilters: ClienteFilters;
}

// Un solo tipo discriminado reemplaza 6 useState de modales
type ModalState =
  | { type: 'none' }
  | { type: 'detail'; clienteId: string }
  | { type: 'pedidos'; clienteId: string }
  | { type: 'edit'; cliente: Cliente };

export function ClientesTable({
  initialData,
  initialStats,
  initialFilters,
}: ClientesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search ?? '');

  const closeModal = () => setModal({ type: 'none' });

  const clientes = initialData?.data ?? [];
  const pagination = initialData?.pagination;
  const stats = initialStats;

  const updateFilters = useCallback(
    (newFilters: Partial<ClienteFilters>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === '') params.delete(key);
        else params.set(key, String(value));
      });
      if (!newFilters.page) params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateFilters({ search: value });
    },
    [updateFilters],
  );

  const handleEstadoFilter = (value: string) =>
    updateFilters({
      estado: value === 'todos' ? undefined : (value as EstadoCliente),
    });

  const handlePageChange = (newPage: number) =>
    updateFilters({ page: newPage });

  // — Acciones ———————————————————————————————————

  const handleEditSubmit = async (data: UpdateClienteInput) => {
    if (modal.type !== 'edit') return;
    setIsSubmitting(true);
    try {
      const result = await updateClientAction(modal.cliente.id, {
        ...data,
        email: data.email === '' ? undefined : data.email,
        direccionPrincipal:
          data.direccionPrincipal === '' ? undefined : data.direccionPrincipal,
      });

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error al actualizar',
          description: result.error,
          duration: 3000,
        });
        return;
      }
      toast({
        title: 'Cliente actualizado',
        description: 'Los datos se actualizaron correctamente',
        duration: 3000,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      console.error('Error updating cliente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clientes"
          value={stats?.total ?? 0}
          icon={<Users className="w-5 h-5" />}
          trend={{
            value: `+${stats?.nuevosEsteMes ?? 0} este mes`,
            positive: true,
          }}
          delay={0}
        />
        <StatCard
          title="Clientes Activos"
          value={stats?.activos ?? 0}
          icon={<UserCheck className="w-5 h-5" />}
          delay={50}
        />
        <StatCard
          title="Clientes Inactivos"
          value={stats?.inactivos ?? 0}
          icon={<UserX className="w-5 h-5" />}
          delay={100}
        />
        <StatCard
          title="Total Pedidos"
          value={stats?.totalPedidos ?? 0}
          icon={<ShoppingBag className="w-5 h-5" />}
          delay={150}
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, teléfono o email..."
              className="pl-9 w-full sm:w-80"
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <Select
            value={initialFilters.estado ?? 'todos'}
            onValueChange={handleEstadoFilter}
          >
            <SelectTrigger className="w-full sm:w-44">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="ACTIVO">Activos</SelectItem>
              <SelectItem value="INACTIVO">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Tabla */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-center">Pedidos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Registrado</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              clientes.map(cliente => (
                <TableRow key={cliente.id} className="group transition-colors">
                  {/* Cliente */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                        {cliente.nombre
                          .split(' ')
                          .map(n => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {cliente.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-18">
                          ID: {cliente.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contacto */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        {cliente.telefono}
                      </div>
                      {cliente.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[180px]">
                            {cliente.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Dirección */}
                  <TableCell>
                    {cliente.direccionPrincipal ? (
                      <div className="flex items-start gap-2 text-sm max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-muted-foreground line-clamp-2">
                          {cliente.direccionPrincipal}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground/50">
                        Sin dirección
                      </span>
                    )}
                  </TableCell>

                  {/* Pedidos */}
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {cliente.totalPedidos}
                    </div>
                  </TableCell>

                  {/* Estado — usa ESTADO_CLIENTE_CONFIG en lugar de dos switch */}
                  <TableCell>
                    <Badge
                      variant={ESTADO_CLIENTE_CONFIG[cliente.estado].variant}
                    >
                      {ESTADO_CLIENTE_CONFIG[cliente.estado].label}
                    </Badge>
                  </TableCell>

                  {/* Fecha */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(cliente.creadoEn)}
                    </span>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setModal({ type: 'detail', clienteId: cliente.id })
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" /> Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setModal({ type: 'edit', cliente })}
                        >
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setModal({ type: 'pedidos', clienteId: cliente.id })
                          }
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" /> Ver pedidos
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Mostrando {clientes.length} de {pagination.total} clientes
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Anterior
            </Button>
            <span>
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modales — el estado discriminado hace imposible abrir dos a la vez */}
      <ClienteEditModal
        isOpen={modal.type === 'edit'}
        onClose={closeModal}
        onSubmit={handleEditSubmit}
        cliente={modal.type === 'edit' ? modal.cliente : null}
        isLoading={isSubmitting}
      />
      <ClienteDetailModal
        isOpen={modal.type === 'detail'}
        onClose={closeModal}
        clienteId={modal.type === 'detail' ? modal.clienteId : null}
      />
      <ClientePedidosModal
        isOpen={modal.type === 'pedidos'}
        onClose={closeModal}
        clienteId={modal.type === 'pedidos' ? modal.clienteId : null}
      />
    </div>
  );
}

// — Subcomponentes ————————————————————————————————

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  delay?: number;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl p-5',
        'transition-all duration-500 hover:shadow-lg hover:shadow-primary/5',
        'animate-in fade-in slide-in-from-bottom-4',
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                'text-xs font-medium flex items-center gap-1',
                trend.positive ? 'text-primary' : 'text-destructive',
              )}
            >
              <TrendingUp
                className={cn('w-3 h-3', !trend.positive && 'rotate-180')}
              />
              {trend.value}
            </p>
          )}
        </div>
        <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
