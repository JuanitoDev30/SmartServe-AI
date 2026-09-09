import { z } from 'zod';

export const estadoReservaOptions = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'SENTADA', label: 'En mesa' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'CANCELADA', label: 'Cancelada' },
  { value: 'NO_ASISTIO', label: 'No asistió' },
] as const;

export const duracionOptions = [
  { value: 60, label: '1 h' },
  { value: 90, label: '1 h 30' },
  { value: 120, label: '2 h' },
  { value: 180, label: '3 h' },
] as const;

// Los campos van sin reglas propias porque solo son obligatorios cuando
// modoCliente es 'nuevo': eso se valida en el superRefine de abajo.
const clienteNuevoSchema = z.object({
  nombre: z.string(),
  telefono: z.string(),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
});

// La fecha y la hora se piden por separado (mejor UX para el anfitrión)
// y se combinan en un ISO al enviar al backend.
export const reservaFormSchema = z
  .object({
    modoCliente: z.enum(['existente', 'nuevo']),
    clienteId: z.string().optional(),
    cliente: clienteNuevoSchema,
    mesaId: z.string().optional(),
    fecha: z.string().min(1, 'Selecciona una fecha'),
    hora: z.string().min(1, 'Selecciona una hora'),
    duracionMinutos: z.number().min(30).max(480),
    numeroPersonas: z
      .number({ message: 'Indica cuántas personas son' })
      .int('Debe ser un número entero')
      .min(1, 'Debe haber al menos 1 persona')
      .max(50, 'El máximo por reserva es 50 personas'),
    notas: z.string().max(300, 'Máximo 300 caracteres').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.modoCliente === 'existente' && !data.clienteId) {
      ctx.addIssue({
        code: 'custom',
        path: ['clienteId'],
        message: 'Selecciona un cliente',
      });
    }

    if (data.modoCliente === 'nuevo') {
      if (data.cliente.nombre.trim().length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['cliente', 'nombre'],
          message: 'El nombre debe tener al menos 2 caracteres',
        });
      }
      if (!/^\d{10}$/.test(data.cliente.telefono)) {
        ctx.addIssue({
          code: 'custom',
          path: ['cliente', 'telefono'],
          message: 'El telefono debe tener exactamente 10 digitos',
        });
      }
    }
  });

export type ReservaFormValues = z.infer<typeof reservaFormSchema>;

export const cancelarReservaSchema = z.object({
  motivoCancelacion: z
    .string()
    .max(200, 'Máximo 200 caracteres')
    .optional()
    .or(z.literal('')),
});

export type CancelarReservaValues = z.infer<typeof cancelarReservaSchema>;
