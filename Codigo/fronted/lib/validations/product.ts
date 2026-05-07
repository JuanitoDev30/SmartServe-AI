// import { z } from 'zod';

// export const productFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, 'El nombre debe tener al menos 2 caracteres')
//     .max(100, 'El nombre no puede exceder 100 caracteres'),
//   description: z
//     .string()
//     .max(500, 'La descripcion no puede exceder 500 caracteres')
//     .optional(),
//   sku: z
//     .string()
//     .min(3, 'El SKU debe tener al menos 3 caracteres')
//     .max(50, 'El SKU no puede exceder 50 caracteres')
//     .regex(
//       /^[A-Za-z0-9-]+$/,
//       'El SKU solo puede contener letras, numeros y guiones',
//     ),
//   category: z.enum(['food', 'beverages', 'electronics', 'clothing', 'other'], {
//     required_error: 'Selecciona una categoria',
//   }),
//   price: z
//     .number({ required_error: 'El precio es requerido' })
//     .min(0, 'El precio no puede ser negativo')
//     .max(999999999, 'El precio es demasiado alto'),
//   costPrice: z
//     .number()
//     .min(0, 'El costo no puede ser negativo')
//     .max(999999999, 'El costo es demasiado alto')
//     .optional(),
//   stock: z
//     .number({ required_error: 'El stock es requerido' })
//     .int('El stock debe ser un numero entero')
//     .min(0, 'El stock no puede ser negativo'),
//   minStock: z
//     .number({ required_error: 'El stock minimo es requerido' })
//     .int('El stock minimo debe ser un numero entero')
//     .min(0, 'El stock minimo no puede ser negativo'),
//   status: z.enum(['active', 'inactive', 'low_stock', 'out_of_stock'], {
//     required_error: 'Selecciona un estado',
//   }),
//   imageUrl: z
//     .string()
//     .url('Ingresa una URL valida')
//     .optional()
//     .or(z.literal('')),
// });

// export type ProductFormValues = z.infer<typeof productFormSchema>;
