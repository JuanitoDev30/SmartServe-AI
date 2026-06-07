'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropDownMenu';
import {
  Bell,
  Menu,
  Search,
  WifiOff,
  Moon,
  Sun,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface AuthUser {
  name: string;
  email?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string | number | Date;
}

interface DashboardHeaderProps {
  onMenuClick: () => void;
  user: AuthUser;
  notifications: Notification[];
  isConnected: boolean;
}

export function DashboardHeader({
  onMenuClick,
  user,
  notifications,
  isConnected,
}: DashboardHeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => setMounted(true), []);
  const isDark = mounted && (resolvedTheme ?? theme) === 'dark';

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-xl md:px-6">
      {/* Lado izquierdo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95 md:hidden"
          aria-label="Menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="group hidden w-64 items-center gap-2.5 rounded-xl border border-transparent bg-muted px-3 py-2 transition-all focus-within:border-ring/40 focus-within:bg-card focus-within:shadow-sm focus-within:ring-2 focus-within:ring-ring/20 md:flex lg:w-80">
          <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <input
            type="text"
            placeholder="Buscar pedidos, clientes..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-1.5">
        {/* Toggle de tema */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="relative grid size-9 place-items-center overflow-hidden rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
          aria-label="Cambiar tema"
        >
          <Sun
            className={cn(
              'size-5 transition-all duration-300',
              isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0 opacity-0',
            )}
          />
          <Moon
            className={cn(
              'absolute size-5 transition-all duration-300',
              isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100',
            )}
          />
        </button>

        {/* Estado de conexión */}
        <div
          className={cn(
            'flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
            isConnected
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-destructive/20 bg-destructive/10 text-destructive',
          )}
        >
          {isConnected ? (
            <>
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">Conectado</span>
            </>
          ) : (
            <>
              <WifiOff className="size-3.5" />
              <span className="hidden sm:inline">Desconectado</span>
            </>
          )}
        </div>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
            aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex animate-badge-pop items-center justify-center">
                <span className="absolute inline-flex size-4 animate-ping rounded-full bg-primary/60" />
                <span className="relative flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground ring-2 ring-card">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm font-semibold">Notificaciones</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            <DropdownMenuSeparator className="my-0" />

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-3 py-8 text-center">
                  <span className="grid size-10 place-items-center rounded-full bg-muted">
                    <Bell className="size-5 text-muted-foreground" />
                  </span>
                  <p className="text-sm text-muted-foreground">
                    No hay notificaciones
                  </p>
                </div>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5 focus:bg-accent"
                  >
                    <div className="flex w-full items-center gap-2">
                      {!notification.read && (
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <span className="text-sm font-medium leading-snug">
                        {notification.title}
                      </span>
                    </div>
                    <span className="text-xs leading-snug text-muted-foreground">
                      {notification.message}
                    </span>
                    <span className="mt-0.5 text-[10px] text-muted-foreground/70">
                      {new Date(notification.createdAt).toLocaleTimeString(
                        'es-CO',
                        { hour: '2-digit', minute: '2-digit' },
                      )}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menú de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="ml-0.5 rounded-full outline-none ring-offset-2 ring-offset-card transition-all hover:ring-2 hover:ring-ring/40 focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
            aria-label="Menú de usuario"
          >
            <Avatar className="size-9 border border-border">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Avatar className="size-9 border border-border">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {user?.name}
                </span>
                {user?.email && (
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard/perfil"
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <User className="size-4" />
                <span>Mi perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="size-4" />
              <span>Configuración</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" className="cursor-pointer">
              <LogOut className="size-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
