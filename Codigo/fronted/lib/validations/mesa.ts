import { z } from 'zod';

export const zonaMesaOptions = [
  { value: 'INTERIOR', label: 'Interior' },
  { value: 'TERRAZA', label: 'Terraza' },
  { value: 'BARRA', label: 'Barra' },
  { value: 'VIP', label: 'VIP' },
  { value: 'PRIVADO', label: 'Privado' },
] as const;

export const mesaFormSchema = z.object({
  numero: z
    .number({ message: 'El número de mesa es requerido' })
    .int('El número debe ser entero')
    .min(1, 'El número debe ser mayor a 0')
    .max(999, 'El número es demasiado alto'),

  capacidad: z
    .number({ message: 'La capacidad es requerida' })
    .int('La capacidad debe ser un entero')
    .min(1, 'La capacidad mínima es 1 persona')
    .max(50, 'La capacidad máxima es 50 personas'),

  zona: z.enum(['INTERIOR', 'TERRAZA', 'BARRA', 'VIP', 'PRIVADO']),

  activa: z.boolean(),

  descripcion: z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .optional(),
});

export type MesaFormValues = z.infer<typeof mesaFormSchema>;
