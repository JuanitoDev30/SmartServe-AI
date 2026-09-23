'use server';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { uploadProductImageUseCase } from '../services/useCases/uploadProductImageUseCase';

/**
 * Sube la imagen al API y devuelve su URL pública. El formulario solo guarda
 * esa URL en el producto: el archivo ya vive en el backend.
 */
export async function uploadProductImageAction(formData: FormData) {
  try {
    const data = await uploadProductImageUseCase.execute(formData);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al subir la imagen'),
    };
  }
}
