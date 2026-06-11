'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { DashboardHeader } from './dashboardHeader';
import { DashboardSidebar } from './dashboardSidebar';
import { AuthUser } from '@/types';
import { PedidosSocketProvider } from '@/lib/providers/pedidosSocketProvider';
import { useNotificationStore } from '@/store/notificationStore';
import { usePedidosStore } from '@/store/pedidosStore';

import { Perfil } from '../perfil/schemas/perfilSchema';
import { PerfilStoreInitializer } from '@/components/perfil/perfilStoreInitialize';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: AuthUser;
  initialPerfil: Perfil | null;
}

export function DashboardLayout({
  children,
  user,
  initialPerfil,
}: DashboardLayoutProps) {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifications = useNotificationStore(state => state.notifications);

  const isConnected = usePedidosStore(state => state.isConnected);

  return (
    <PedidosSocketProvider>
      {initialPerfil && <PerfilStoreInitializer perfil={initialPerfil} />}

      <div className="flex h-dvh w-full bg-background overflow-hidden">
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="hidden md:block">
          <DashboardSidebar
            user={user}
            collapsed={sideBarCollapsed}
            onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
          />
        </div>

        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <DashboardSidebar
            user={user}
            collapsed={false}
            onToggle={() => setMobileMenuOpen(false)}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeader
            onMenuClick={() => setMobileMenuOpen(true)}
            user={user}
            notifications={notifications}
            isConnected={isConnected}
          />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </PedidosSocketProvider>
  );
}
