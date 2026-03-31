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
  MessageCirclePlus,
  MoreVertical,
  Users,
  Star,
  Settings,
  LogOut,
  CircleDot,
} from 'lucide-react';

interface SideBarHeaderProps {
  onNewChat: () => void;
}

export function SidebarHeader({ onNewChat }: SideBarHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-card px-4 py-3 border-b border-border">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
            YO
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground">Mi Cuenta</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onNewChat}
          className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Nuevo chat"
        >
          <MessageCirclePlus className="size-5" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Menu"
            >
              <MoreVertical className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem>
              <Users className="size-4" />
              Nuevo grupo
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="size-4" />
              Mensajes destacados
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CircleDot className="size-4" />
              Estado
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="size-4" />
              Configuracion
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-4" />
              Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
