import { updatePerfilAction } from '@/features/perfil/actions/updatePerfilAction';
import {
  Perfil,
  UpdatePerfilInput,
  updatePerfilSchema,
} from '@/features/perfil/schemas/perfilSchema';
import { usePerfilStore } from '@/store/perfilStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from './useToast';

export function usePerfilForm(initialData: Perfil | null) {
  const [perfil, setPerfil] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updatePerfilStore = usePerfilStore(state => state.updatePerfil);

  const form = useForm<UpdatePerfilInput>({
    resolver: zodResolver(updatePerfilSchema),
    defaultValues: {
      nombre: perfil?.nombre ?? '',
      email: perfil?.email ?? '',
      telefono: perfil?.telefono ?? '',
    },
  });

  const onSubmit = async (data: UpdatePerfilInput) => {
    setIsSubmitting(true);
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
      setPerfil(result.data ?? perfil);
      updatePerfilStore(result.data ?? data);
      toast({
        title: 'Perfil actualizado',
        description: 'Tu información fue actualizada correctamente',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { perfil, form, isSubmitting, onSubmit };
}
