import { randomUUID } from 'crypto';
import { Request } from 'express';

type FileNamerCallback = (error: Error | null, filename: string) => void;

/**
 * Nombre aleatorio para el archivo guardado: evita colisiones y que el
 * nombre original del cliente llegue al sistema de archivos.
 */
export const fileNamer = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileNamerCallback,
) => {
  const extension = file.mimetype.split('/')[1].replace('jpeg', 'jpg');
  callback(null, `${randomUUID()}.${extension}`);
};
