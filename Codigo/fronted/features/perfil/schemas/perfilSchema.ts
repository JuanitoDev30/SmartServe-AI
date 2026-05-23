import { z } from 'zod';

export const perfilSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  email: z.string().email(),
  telefono: z.string().optional().nullable(),
  activo: z.boolean(),
  creadoEn: z.coerce.date(),
  actualizadoEn: z.coerce.date(),
});

export const updatePerfilSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .optional(),
  email: z.string().email('Email inválido').optional(),
  telefono: z
    .string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .optional(),
});

export const changePasswordSchema = z
  .object({
    passwordActual: z.string().min(1, 'Ingresa tu contraseña actual'),
    passwordNuevo: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    passwordConfirm: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine(data => data.passwordNuevo === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  });

export type Perfil = z.infer<typeof perfilSchema>;
export type UpdatePerfilInput = z.infer<typeof updatePerfilSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
