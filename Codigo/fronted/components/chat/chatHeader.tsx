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
  UserX,
  Volume2,
  Trash2,
  RotateCcw,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import { chatRepository } from '@/features/chat/services/repositories/chatRepository';
import { toast } from '@/hooks/useToast';
import { ToolTracePanel } from './tooTracePanel';

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
  return avatarColors[parseInt(id) % avatarColors.length];
}

interface ChatHeaderProps {
  contact: Contact;
  onBack: () => void;
  onSearch: () => void;
  onReset?: () => void;
}

export function ChatHeader({
  contact,
  onBack,
  onSearch,
  onReset,
}: ChatHeaderProps) {
  const [showToolTrace, setShowToolTrace] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const statusText =
    contact.status === 'online'
      ? 'en linea'
      : contact.status === 'typing'
        ? 'escribiendo...'
        : contact.lastSeen || 'desconectado';

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await chatRepository.resetSession();
      onReset?.();
      toast({
        title: 'Sesión reiniciada',
        description: 'El agente olvidó la conversación anterior.',
        duration: 3000,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error al reiniciar',
        duration: 3000,
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 bg-card px-3 py-2 border-b border-border">
        <button
          onClick={onBack}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
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
              contact.status === 'online' || contact.status === 'typing'
                ? 'text-primary'
                : 'text-muted-foreground',
            )}
          >
            {statusText}
          </p>
        </div>

        <div className="flex items-center gap-0.5">
          {/* 👇 Reset sesión */}
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
            aria-label="Reiniciar sesión del agente"
            title="Reiniciar sesión"
          >
            <RotateCcw
              className={cn('size-5', isResetting && 'animate-spin')}
            />
          </button>

          {/* 👇 Tool trace */}
          <button
            onClick={() => setShowToolTrace(true)}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Ver herramientas usadas"
            title="Tool trace"
          >
            <Wrench className="size-5" />
          </button>

          <button
            onClick={onSearch}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Search className="size-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
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

      {/* Panel tool trace */}
      <ToolTracePanel
        isOpen={showToolTrace}
        onClose={() => setShowToolTrace(false)}
      />
    </>
  );
}
