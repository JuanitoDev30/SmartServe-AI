'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { DashboardHeader } from './dashboardHeader';
import { DashboardSidebar } from './dashboardSidebar';
import { AuthUser } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: AuthUser;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
