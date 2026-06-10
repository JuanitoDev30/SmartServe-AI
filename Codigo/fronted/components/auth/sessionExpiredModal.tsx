'use client';

import { useAuthStore } from '@/store/authStore';
import { signOut } from 'next-auth/react';
import { LogIn, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SessionExpiredModal() {
  const { sessionExpired, setSessionExpired } = useAuthStore();

  const handleLogin = async () => {
    setSessionExpired(false);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <AnimatePresence>
      {sessionExpired && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-8 text-center space-y-6">
              {/* Icono */}
              <div className="flex justify-center">
                <div className="size-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Clock className="size-8 text-orange-500" />
                </div>
              </div>

              {/* Texto */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Sesión expirada
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tu sesión ha expirado por inactividad. Por favor inicia sesión
                  nuevamente para continuar.
                </p>
              </div>

              {/* Botón */}
              <button
                onClick={handleLogin}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LogIn className="size-4" />
                Iniciar sesión nuevamente
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
