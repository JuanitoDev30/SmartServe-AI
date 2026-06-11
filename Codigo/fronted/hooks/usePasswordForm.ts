import { changePasswordAction } from '@/features/perfil/actions/changePasswordAction';
import {
  ChangePasswordInput,
  changePasswordSchema,
} from '@/features/perfil/schemas/perfilSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from './useToast';

export function usePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      passwordActual: '',
      passwordNuevo: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsSubmitting(true);

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
      form.reset();
      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña fue cambiada correctamente',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
  };
}
