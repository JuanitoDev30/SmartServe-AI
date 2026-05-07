import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropDownMenu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useNotificationStore } from '@/store/notificationStore';
import { Bell, Menu, Search } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const notifications = useNotificationStore(state => state.notifications);

  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-card border-b border-border">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
          aria-label="Menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="hidden md:flex items-center gap-3 rounded-lg bg-muted px-3 py-2 w-64">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <Bell className="size-5" />

              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 font-semibold text-sm">
              Notificaciones
            </div>

            <DropdownMenuSeparator />

            {notifications.length === 0 ? (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                No hay notificaciones
              </div>
            ) : (
              notifications.map(notification => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start py-3"
                >
                  <span className="text-sm font-medium">
                    {notification.title}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {notification.message}
                  </span>

                  <span className="text-[10px] text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString(
                      'es-CO',
                    )}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* DROPDOWN MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Mi perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuracion</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
