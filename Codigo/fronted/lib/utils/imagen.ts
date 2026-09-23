/**
 * Resuelve el valor guardado en `producto.imagen` a una URL usable en <img>.
 *
 * Acepta las tres formas con las que puede llegar: URL absoluta (una imagen
 * externa pegada a mano), ruta del API (`/files/producto/x.jpg`) o solo el
 * nombre del archivo subido.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function resolveImagenUrl(
  imagen?: string | null,
): string | undefined {
  const valor = imagen?.trim();
  if (!valor) return undefined;

  if (valor.startsWith('http://') || valor.startsWith('https://')) {
    return valor;
  }

  if (valor.startsWith('/')) return `${API_URL}${valor}`;

  return `${API_URL}/api/files/producto/${valor}`;
}

/** Extensiones y peso que acepta el backend, para validar antes de subir */
export const IMAGEN_MIME_PERMITIDOS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const IMAGEN_TAMANO_MAXIMO = 3 * 1024 * 1024; // 3 MB

export function validarImagen(file: File): string | null {
  if (!IMAGEN_MIME_PERMITIDOS.includes(file.type)) {
    return 'Formato no permitido. Usa JPG, PNG, WEBP o AVIF';
  }

  if (file.size > IMAGEN_TAMANO_MAXIMO) {
    return 'La imagen no puede pesar más de 3 MB';
  }

  return null;
}
