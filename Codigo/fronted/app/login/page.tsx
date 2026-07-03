import { cn } from '@/lib/utils';
import { LayoutDashboard, Clock } from 'lucide-react';
import { LoginForm } from '@/components/auth/loginForm';
import FloatingShapes from '@/components/auth/floatingShapes';

interface LoginPageProps {
  searchParams: Promise<{
    expired?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;
  const expired = params.expired;

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-background">
      <FloatingShapes />

      <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className={cn(
              'inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground mb-2',
              'transition-all duration-500 hover:scale-105',
              'shadow-lg shadow-primary/25',
            )}
          >
            <LayoutDashboard className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight text-balance">
              Bienvenido de nuevo
            </h1>
            <p className="text-muted-foreground mt-1.5">
              Ingresa a tu panel de administración
            </p>
          </div>
        </div>

        {/* Banner sesión expirada */}
        {expired && (
          <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-500">
            <Clock className="size-4 shrink-0" />
            Tu sesión ha expirado, inicia sesión nuevamente.
          </div>
        )}

        {/* Card */}
        <div
          className={cn(
            'rounded-2xl p-7 space-y-6',
            'bg-card border border-border',
            'shadow-xl shadow-black/5',
            'animate-in fade-in zoom-in-95 duration-500',
          )}
        >
          <LoginForm callbackUrl="/dashboard" />
        </div>

        {/* Footer */}
        <p
          className={cn(
            'text-center text-sm text-muted-foreground',
            'animate-in fade-in duration-500',
          )}
          style={{ animationDelay: '300ms' }}
        >
          Acceso exclusivo para administradores
        </p>
      </div>
    </div>
  );
}