import { z } from 'zod';

export const categorySchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export interface CategoryType {
  id: string;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}