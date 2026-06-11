'use client';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import type { ChangePasswordInput } from '@/features/perfil/schemas/perfilSchema';
import { usePasswordForm } from '@/hooks/usePasswordForm';

// 👇 Fuera del componente
interface PasswordFieldProps {
  name: 'passwordActual' | 'passwordNuevo' | 'passwordConfirm';
  label: string;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  register: UseFormRegister<ChangePasswordInput>;
  errors: FieldErrors<ChangePasswordInput>;
}

function PasswordField({
  name,
  label,
  placeholder,
  show,
  onToggle,
  register,
  errors,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          {...register(name)}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={cn(
            'pl-9 pr-10',
            errors[name] && 'border-destructive focus-visible:ring-destructive',
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {errors[name] && (
        <p className="text-sm text-destructive">{errors[name]?.message}</p>
      )}
    </div>
  );
}

export function PerfilPasswordForm() {
  const { form, isSubmitting, onSubmit } = usePasswordForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [showActual, setShowActual] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Shield className="size-4 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">Seguridad</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordField
          name="passwordActual"
          label="Contraseña actual"
          placeholder="••••••••"
          show={showActual}
          onToggle={() => setShowActual(p => !p)}
          register={register}
          errors={errors}
        />
        <PasswordField
          name="passwordNuevo"
          label="Nueva contraseña"
          placeholder="Mínimo 8 caracteres"
          show={showNuevo}
          onToggle={() => setShowNuevo(p => !p)}
          register={register}
          errors={errors}
        />
        <PasswordField
          name="passwordConfirm"
          label="Confirmar nueva contraseña"
          placeholder="Repite la nueva contraseña"
          show={showConfirm}
          onToggle={() => setShowConfirm(p => !p)}
          register={register}
          errors={errors}
        />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
              'hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSubmitting ? (
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
  );
}
