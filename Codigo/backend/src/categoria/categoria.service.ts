import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  private logger = new Logger('CategoriaService');

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // CREATE
  async create(createCategoriaDto: CreateCategoriaDto) {
    const { nombre } = createCategoriaDto;

    const existe = await this.categoriaRepository.findOneBy({ nombre });

    if (existe) {
      throw new BadRequestException(`La categoría '${nombre}' ya existe`);
    }

    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto);
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET ALL
  async findAll() {
    return await this.categoriaRepository.find();
  }

  // GET ONE
  async findOne(id: string) {
    const categoria = await this.categoriaRepository.findOneBy({ id });

    if (!categoria) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    return categoria;
  }

  // UPDATE
  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepository.preload({
      id,
      ...updateCategoriaDto,
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    try {
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // DELETE
  async remove(id: string) {
    const categoria = await this.findOne(id);

    try {
      return await this.categoriaRepository.remove(categoria);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'No se puede eliminar la categoría porque tiene productos asociados. Elimina o reasigna los productos primero.',
        );
      }
      throw error;
    }
  }

  // MANEJO DE ERRORES
  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Categoría duplicada');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error en el servidor');
  }
}
