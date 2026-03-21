import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductoService {
  private readonly logger = new Logger('ProductoService');

  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    try {
      const producto = this.productRepository.create(createProductoDto);

      await this.productRepository.save(producto);
      return producto;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET

  findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return this.productRepository.find({
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET ONE

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return product;
  }

  // UPDATE

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductoDto,
    });

    if (!product)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // DELETE

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  private handleExceptions(error: any) {
    //console.log(error);
    if ((error as any).code === '23505')
      throw new BadRequestException((error as any).detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Error al crear el producto');
  }
}
