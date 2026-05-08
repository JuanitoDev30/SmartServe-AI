import { z } from 'zod';

export const productFormSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),

  slug: z
    .string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(50, 'El slug no puede exceder 50 caracteres')
    .regex(
      /^[A-Za-z0-9-]+$/,
      'El slug solo puede contener letras, números y guiones',
    ),

  categoriaId: z.string().min(1, 'Debes seleccionar una categoría'),

  precio: z
    .number({ message: 'El precio es requerido' })
    .min(0, 'El precio no puede ser negativo')
    .max(999_999_999, 'El precio es demasiado alto'),

  stock: z
    .number({ message: 'El stock es requerido' })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),

  proveedor: z
    .string()
    .max(100, 'El proveedor no puede exceder 100 caracteres')
    .optional(),

  status: z.enum(['active', 'inactive', 'low_stock', 'out_of_stock']),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
