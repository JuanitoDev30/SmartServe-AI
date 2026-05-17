'use client';

import { useState, useMemo, useCallback } from 'react';
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
  Trash2,
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
  DropdownMenuSeparator,
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
} from '@/features/clientes/schemas/clientSchema';

interface ClientesTableProps {
  initialData: PaginatedClientes | null;
  initialStats: ClienteStats | null;
  initialFilters: ClienteFilters;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
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
function getEstadoBadgeVariant(estado: EstadoCliente) {
  switch (estado) {
    case 'ACTIVO':
      return 'default';
    case 'INACTIVO':
      return 'secondary';
    case 'SUSPENDIDO':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getEstadoLabel(estado: EstadoCliente) {
  switch (estado) {
    case 'ACTIVO':
      return 'Activo';
    case 'INACTIVO':
      return 'Inactivo';
    case 'SUSPENDIDO':
      return 'Suspendido';
    default:
      return estado;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function ClientesTable({
  initialData,
  initialStats,
  initialFilters,
}: ClientesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search ?? '');

  const clientes = initialData?.data ?? [];
  const pagination = initialData?.pagination;
  const stats = initialStats;

  // Actualiza los searchParams y Next.js re-fetcha desde el servidor
  const updateFilters = useCallback(
    (newFilters: Partial<ClienteFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset page al cambiar filtros
      if (!newFilters.page) params.set('page', '1');

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      const timeout = setTimeout(() => updateFilters({ search: value }), 400);
      return () => clearTimeout(timeout);
    },
    [updateFilters],
  );

  const handleEstadoFilter = (value: string) => {
    updateFilters({
      estado: value === 'todos' ? undefined : (value as EstadoCliente),
    });
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  const handleDesactivar = async (cliente: Cliente) => {
    setIsDeleting(cliente.id);
    // try {
    //   const result = await deleteClienteAction(cliente.id);
    //   if (!result.success) {
    //     toast({ variant: 'destructive', title: 'Error', description: result.error, duration: 3000 });
    //     return;
    //   }
    //   toast({ title: 'Cliente desactivado', description: `${cliente.nombre} fue desactivado`, duration: 3000 });
    //   router.refresh(); // 👈 re-ejecuta la page server component
    // } finally {
    //   setIsDeleting(null);
    // }
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
              <SelectItem value="SUSPENDIDO">Suspendidos</SelectItem>
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
              <TableHead className="w-[50px]"></TableHead>
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
              clientes.map((cliente, index) => (
                <TableRow key={cliente.id} className="group transition-colors">
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
                        <p className="text-xs text-muted-foreground">
                          ID: {cliente.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
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
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {cliente.totalPedidos}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadgeVariant(cliente.estado)}>
                      {getEstadoLabel(cliente.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(new Date(cliente.creadoEn))}
                    </span>
                  </TableCell>
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
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Ver pedidos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          disabled={isDeleting === cliente.id}
                          onClick={() => handleDesactivar(cliente)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {isDeleting === cliente.id
                            ? 'Desactivando...'
                            : 'Desactivar'}
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
    </div>
  );
}
