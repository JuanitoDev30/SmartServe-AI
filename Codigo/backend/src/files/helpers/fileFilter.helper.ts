import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const MIME_TYPES_PERMITIDOS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

type FileFilterCallback = (
  error: Error | null,
  acceptFile: boolean,
) => void;

export const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (!file) {
    return callback(new BadRequestException('No se recibió ningún archivo'), false);
  }

  if (!MIME_TYPES_PERMITIDOS.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        `Formato no permitido (${file.mimetype}). Usa JPG, PNG, WEBP o AVIF`,
      ),
      false,
    );
  }

  callback(null, true);
};
