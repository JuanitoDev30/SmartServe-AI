import { LogoutButton } from '@/components/sideBar/logoutButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AuthUser } from '@/types';
import {
  Archive,
  BarChart3,
  ChevronLeft,
  LayoutDashboard,
  MessageSquare,
  Package,
  Tags,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePerfilStore } from '@/store/perfilStore';

const navItems = [
  {
    label: 'Vista general',
    href: '/dashboard',
    icon: LayoutDashboard,
  },

  {
    label: 'Clientes',
    href: '/dashboard/clientes',
    icon: User,
  },
  {
    label: 'Pedidos',
    href: '/dashboard/pedido',
    icon: Package,
  },

  {
    label: 'Reportes',
    href: '/dashboard/reportes',
    icon: BarChart3,
  },
  {
    label: 'Inventario',
    href: '/dashboard/inventario',
    icon: Archive,
  },
  {
    label: 'Categorias',
    href: '/dashboard/categorias',
    icon: Tags,
  },

  // {
  //   label: 'Configuracion',
  //   href: '/dashboard/settings',
  //   icon: Settings,
  // },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: AuthUser;
}

export function DashboardSidebar({
  collapsed,
  onToggle,
  user,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const perfil = usePerfilStore(state => state.perfil);
  const nombre = perfil?.nombre ?? user?.name ?? '';
  const email = perfil?.email ?? user?.email ?? '';
  const iniciales = nombre
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card border-r border-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        {!collapsed && (
          <span className="text-lg font-semibold text-foreground">
            Dashboard
          </span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
            collapsed && 'mx-auto',
          )}
          aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
        >
          <ChevronLeft
            className={cn(
              'size-5 transition-transform',
              collapsed && 'rotate-180',
            )}
          />
        </button>
      </div>

      {/* NAVIGATION ITEMS */}

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
            >
              <item.icon className="size-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}

      <div className="border-t border-border p-2 space-y-1">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
            collapsed && 'justify-center px-2',
          )}
        >
          <MessageSquare className="size-5 shrink-0" />
          {!collapsed && <span>Ir al chat</span>}
        </Link>
        <LogoutButton collapsed={collapsed} />
      </div>

      {/* USER */}
      {!collapsed && (
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback key={iniciales}>{iniciales}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {nombre}
              </p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
