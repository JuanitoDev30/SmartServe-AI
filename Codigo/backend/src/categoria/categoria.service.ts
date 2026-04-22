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
  handleException: any;

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto);
      await this.categoriaRepository.save(categoria);
      return categoria;
    } catch (error) {
      this.handleException;
    }
  }
  async findAll() {
    return await this.categoriaRepository.find();
  }

  findOne(id: number) {}

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {}

  remove(id: number) {}
}
