'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/useToast';
import {
  type Perfil,
  type UpdatePerfilInput,
  type ChangePasswordInput,
  updatePerfilSchema,
  changePasswordSchema,
} from '../../perfil/schemas/perfilSchema';
import { updatePerfilAction } from '@/features/perfil/actions/updatePerfilAction';
import { changePasswordAction } from '@/features/perfil/actions/changePasswordAction';
import { usePerfilStore } from '@/store/perfilStore';

interface PerfilPageProps {
  initialData: Perfil | null;
}

export function PerfilPage({ initialData }: PerfilPageProps) {
  const [perfil, setPerfil] = useState(initialData);
  const [isSubmittingPerfil, setIsSubmittingPerfil] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showPasswordNuevo, setShowPasswordNuevo] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const updatePerfil = usePerfilStore(state => state.updatePerfil);

  // Form perfil
  const {
    register: registerPerfil,
    handleSubmit: handleSubmitPerfil,
    formState: { errors: errorsPerfil },
  } = useForm<UpdatePerfilInput>({
    resolver: zodResolver(updatePerfilSchema),
    defaultValues: {
      nombre: perfil?.nombre ?? '',
      email: perfil?.email ?? '',
      telefono: perfil?.telefono ?? '',
    },
  });

  // Form password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      passwordActual: '',
      passwordNuevo: '',
      passwordConfirm: '',
    },
  });

  const onSubmitPerfil = async (data: UpdatePerfilInput) => {
    setIsSubmittingPerfil(true);
    try {
      const result = await updatePerfilAction(data);

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error al actualizar perfil',
          description: result.error,
          duration: 3000,
        });
        return;
      }

      // Actualiza el estado local del form Y el store global
      setPerfil(result.data ?? perfil);
      updatePerfil(result.data ?? data);

      toast({
        title: 'Perfil actualizado',
        description: 'Tu información fue actualizada correctamente',
        duration: 3000,
      });
    } finally {
      setIsSubmittingPerfil(false);
    }
  };

  const onSubmitPassword = async (data: ChangePasswordInput) => {
    setIsSubmittingPassword(true);
    try {
      const result = await changePasswordAction(data);
      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error al cambiar contraseña',
          description: result.error,
          duration: 3000,
        });
        return;
      }
      resetPassword();
      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña fue cambiada correctamente',
        duration: 3000,
      });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mi Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administra tu información personal y seguridad
        </p>
      </div>

      {/* Avatar + info básica */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shrink-0">
            {perfil?.nombre
              ?.split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('') ?? 'AD'}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {perfil?.nombre}
            </p>
            <p className="text-sm text-muted-foreground">{perfil?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-500 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Administrador activo
            </span>
          </div>
        </div>
      </div>

      {/* Información personal */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <User className="size-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">
            Información Personal
          </h2>
        </div>

        <form
          onSubmit={handleSubmitPerfil(onSubmitPerfil)}
          className="space-y-4"
        >
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nombre completo
            </label>
            <Input
              {...registerPerfil('nombre')}
              placeholder="Tu nombre"
              className={cn(
                errorsPerfil.nombre &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
            {errorsPerfil.nombre && (
              <p className="text-sm text-destructive">
                {errorsPerfil.nombre.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                {...registerPerfil('email')}
                type="email"
                placeholder="tu@email.com"
                className={cn(
                  'pl-9',
                  errorsPerfil.email &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
            </div>
            {errorsPerfil.email && (
              <p className="text-sm text-destructive">
                {errorsPerfil.email.message}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Teléfono <span className="text-muted-foreground">(opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                {...registerPerfil('telefono')}
                type="tel"
                placeholder="3001234567"
                className={cn(
                  'pl-9',
                  errorsPerfil.telefono &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
            </div>
            {errorsPerfil.telefono && (
              <p className="text-sm text-destructive">
                {errorsPerfil.telefono.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmittingPerfil}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {isSubmittingPerfil ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Seguridad */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Seguridad</h2>
        </div>

        <form
          onSubmit={handleSubmitPassword(onSubmitPassword)}
          className="space-y-4"
        >
          {/* Contraseña actual */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Contraseña actual
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                {...registerPassword('passwordActual')}
                type={showPasswordActual ? 'text' : 'password'}
                placeholder="••••••••"
                className={cn(
                  'pl-9 pr-10',
                  errorsPassword.passwordActual &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswordActual(!showPasswordActual)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswordActual ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errorsPassword.passwordActual && (
              <p className="text-sm text-destructive">
                {errorsPassword.passwordActual.message}
              </p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                {...registerPassword('passwordNuevo')}
                type={showPasswordNuevo ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                className={cn(
                  'pl-9 pr-10',
                  errorsPassword.passwordNuevo &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswordNuevo(!showPasswordNuevo)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswordNuevo ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errorsPassword.passwordNuevo && (
              <p className="text-sm text-destructive">
                {errorsPassword.passwordNuevo.message}
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                {...registerPassword('passwordConfirm')}
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="Repite la nueva contraseña"
                className={cn(
                  'pl-9 pr-10',
                  errorsPassword.passwordConfirm &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswordConfirm ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errorsPassword.passwordConfirm && (
              <p className="text-sm text-destructive">
                {errorsPassword.passwordConfirm.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {isSubmittingPassword ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Cambiando...
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Cambiar contraseña
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
