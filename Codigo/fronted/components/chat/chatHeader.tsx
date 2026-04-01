'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropDownMenu';
import type { Contact } from '@/lib/chat-data';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Phone,
  Video,
  UserX,
  Volume2,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const avatarColors = [
  'bg-emerald-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-orange-600',
  'bg-cyan-600',
  'bg-pink-600',
  'bg-lime-600',
];

function getAvatarColor(id: string) {
  const index = parseInt(id) % avatarColors.length;
  return avatarColors[index];
}

interface ChatHeaderProps {
  contact: Contact;
  onBack: () => void;
  onSearch: () => void;
}

export function ChatHeader({ contact, onBack, onSearch }: ChatHeaderProps) {
  const statusText =
    contact.status === 'online'
      ? 'en linea'
      : contact.status === 'typing'
        ? 'escribiendo...'
        : contact.lastSeen || 'desconectado';

  return (
    <div className="flex items-center gap-2 bg-card px-3 py-2 border-b border-border">
      <button
        onClick={onBack}
        className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
        aria-label="Volver"
      >
        <ArrowLeft className="size-5" />
      </button>
      <Avatar className="size-10 shrink-0">
        <AvatarFallback
          className={cn(
            'text-sm font-semibold text-card',
            getAvatarColor(contact.id),
          )}
        >
          {contact.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 ml-1">
        <p className="text-base font-medium text-foreground truncate leading-tight">
          {contact.name}
        </p>
        <p
          className={cn(
            'text-xs truncate leading-tight mt-0.5',
            contact.status === 'online'
              ? 'text-primary'
              : contact.status === 'typing'
                ? 'text-primary'
                : 'text-muted-foreground',
          )}
        >
          {statusText}
        </p>
      </div>
      <div className="flex items-center gap-0.5">
        <button
          className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Videollamada"
        >
          <Video className="size-5" />
        </button>
        <button
          className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Llamar"
        >
          <Phone className="size-5" />
        </button>
        <button
          onClick={onSearch}
          className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Buscar en chat"
        >
          <Search className="size-5" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Mas opciones"
            >
              <MoreVertical className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Volume2 className="size-4" />
              Silenciar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserX className="size-4" />
              Bloquear
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 className="size-4" />
              Eliminar chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
