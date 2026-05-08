import { z } from 'zod';

export const categorySchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s]+$/, 'El nombre contiene caracteres inválidos')
    .transform(value => value.replace(/\s+/g, ' ')),

  descripcion: z
    .string()
    .trim()
    .max(200, 'La descripción no puede superar los 200 caracteres')
    .transform(value => value.replace(/\s+/g, ' '))
    .optional()
    .or(z.literal('')),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export interface CategoryType {
  id: string;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}
