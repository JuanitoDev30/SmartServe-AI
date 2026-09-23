import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

export const CARPETA_PRODUCTOS = join(__dirname, '../../static/productos');

@Injectable()
export class FilesService {
  /** Ruta absoluta de la imagen de un producto, validando que exista */
  getStaticProductoImage(imageName: string): string {
    // El nombre viaja en la URL: sin esto, un `..` saca la lectura de la carpeta
    if (imageName.includes('..') || imageName.includes('/')) {
      throw new BadRequestException('Nombre de imagen inválido');
    }

    const path = join(CARPETA_PRODUCTOS, imageName);

    if (!existsSync(path)) {
      throw new NotFoundException(`No existe la imagen ${imageName}`);
    }

    return path;
  }

  /** URL pública con la que el dashboard y el agente referencian la imagen */
  buildProductoImageUrl(fileName: string): string {
    const host = process.env.HOST_API ?? 'http://localhost:3001/api';
    return `${host}/files/producto/${fileName}`;
  }

  /** Borra el archivo si sigue en disco; silencioso si ya no está */
  removeProductoImage(fileName: string): void {
    const path = join(CARPETA_PRODUCTOS, fileName);
    if (existsSync(path)) unlinkSync(path);
  }
}
