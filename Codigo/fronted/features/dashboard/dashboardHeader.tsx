import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropDownMenu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Bell, Menu, Search } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
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
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive" />
        </button>

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
