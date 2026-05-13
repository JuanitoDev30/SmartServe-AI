'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import z from 'zod';
import { signIn } from 'next-auth/react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = '/dashboard' }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else if (result?.ok) {
        router.push(callbackUrl);
        // router.reload();
      }
    } catch {
      setAuthError('Error al iniciar sesión. Intenta de nuevo.');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail
            className={cn(
              'absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] transition-colors duration-200',
              focusedField === 'email'
                ? 'text-primary'
                : 'text-muted-foreground',
            )}
          />
          <input
            id="email"
            type="email"
            {...register('email')}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="admin@empresa.com"
            className={cn(
              'w-full rounded-lg border bg-input pl-11 pr-4 py-3 text-sm',
              'placeholder:text-muted-foreground/60',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary',
              'hover:border-primary/40',
              errors.email &&
                'border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive',
            )}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Contraseña
        </label>
        <div className="relative">
          <Lock
            className={cn(
              'absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] transition-colors duration-200',
              focusedField === 'password'
                ? 'text-primary'
                : 'text-muted-foreground',
            )}
          />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            placeholder="Ingresa tu contraseña"
            className={cn(
              'w-full rounded-lg border bg-input pl-11 pr-11 py-3 text-sm',
              'placeholder:text-muted-foreground/60',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary',
              'hover:border-primary/40',
              errors.password &&
                'border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive',
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {showPassword ? (
              <EyeOff className="size-[18px]" />
            ) : (
              <Eye className="size-[18px]" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Auth Error */}
      {authError && (
        <div className="rounded-lg px-4 py-3 bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-sm text-destructive">{authError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'relative w-full rounded-lg px-4 py-3 text-sm font-semibold',
          'bg-primary text-primary-foreground',
          'transition-all duration-200',
          'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20',
          'active:scale-[0.98]',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none',
          'flex items-center justify-center gap-2',
          'overflow-hidden group',
        )}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {isSubmitting ? (
          <>
            <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            <span>Verificando...</span>
          </>
        ) : (
          <span>Iniciar sesión</span>
        )}
      </button>
    </form>
  );
}
