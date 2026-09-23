import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';

import { FilesService, CARPETA_PRODUCTOS } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { Public } from '../auth/decorators/public.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Pública a propósito: la usan el <img> del dashboard y el agente cuando
   * le manda la foto del plato al cliente por WhatsApp. Subir sí requiere
   * sesión.
   */
  @Get('producto/:imageName')
  @Public()
  findProductoImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductoImage(imageName);

    // Las imágenes son inmutables: cada subida genera un nombre nuevo
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(path);
  }

  @Post('producto')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: CARPETA_PRODUCTOS,
        filename: fileNamer,
      }),
      limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    }),
  )
  uploadProductoImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ninguna imagen válida');
    }

    return {
      fileName: file.originalname,
      secureUrl: this.filesService.buildProductoImageUrl(file.filename),
    };
  }

  @Delete('producto/:imageName')
  removeProductoImage(@Param('imageName') imageName: string) {
    // Reusa la validación de nombre y el 404 del getter
    this.filesService.getStaticProductoImage(imageName);
    this.filesService.removeProductoImage(imageName);

    return { mensaje: `Imagen ${imageName} eliminada` };
  }
}
