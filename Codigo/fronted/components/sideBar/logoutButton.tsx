'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  collapsed?: boolean;
  dropdown?: boolean;
}

export const LogoutButton = ({ collapsed, dropdown }: LogoutButtonProps) => {
  if (dropdown) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="flex w-full items-center gap-2"
      >
        <LogOut className="size-4" />
        <span>Cerrar sesión</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors',
        collapsed && 'justify-center px-2',
      )}
    >
      <LogOut className="size-5 shrink-0" />

      {!collapsed && <span>Cerrar sesión</span>}
    </button>
  );
};
