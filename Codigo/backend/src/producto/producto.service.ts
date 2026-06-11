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
import { ILike, In, Not, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Injectable()
export class ProductoService {
  private readonly logger = new Logger('ProductoService');

  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // backend - productoService.ts
  async create(createProductoDto: CreateProductoDto) {
    const { nombre, slug, categoriaId, ...rest } = createProductoDto;

    const responseSlug = await this.findOneBySlug(slug!);
    if (responseSlug) throw new BadRequestException(responseSlug.message);

    const responseName = await this.findOneByName(nombre!);
    if (responseName) throw new BadRequestException(responseName.message);

    try {
      const producto = this.productRepository.create({
        nombre,
        slug,
        ...rest,
      });

      if (categoriaId) {
        const categoria = await this.categoriaRepository.findOneBy({
          id: categoriaId,
        });

        if (!categoria) {
          throw new NotFoundException(
            `Categoría con id ${categoriaId} no encontrada`,
          );
        }

        producto.categoria = categoria;
      }

      if (producto.stock === 0 || !producto.stock) {
        producto.status = 'out_of_stock';
      } else if (producto.stock < 5) {
        producto.status = 'low_stock';
      } else {
        producto.status = 'active';
      }

      await this.productRepository.save(producto);

      await this.productRepository.save(producto);
      return producto;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET

  findAll(paginationDto: PaginationDto) {
    try {
      const { page = 1, pageSize = 10, search = '' } = paginationDto;
      const offset = (page - 1) * pageSize;

      return this.productRepository.find({
        take: pageSize,
        skip: offset,
        where: search ? { nombre: ILike(`%${search}%`) } : {},
        relations: { categoria: true },
      });
    } catch (error) {
      throw this.handleExceptions(error);
    }
  }

  // GET ONE

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        categoria: true,
      },
    });
    if (!product)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return product;
  }

  // Get One by Slug

  async findOneBySlug(slug: string) {
    const product = await this.productRepository
      .createQueryBuilder('producto')
      .where('producto.slug = :slug', { slug })
      .andWhere('producto.deletedAt IS NULL')
      .getOne();

    if (product) return { message: `Producto con slug ${slug} ya registrado` };
    return null;
  }
  // Get one by name
  async findOneByName(nombre: string) {
    const product = await this.productRepository
      .createQueryBuilder('producto')
      .where('producto.nombre = :nombre', { nombre })
      .andWhere('producto.deletedAt IS NULL')
      .getOne();

    if (product)
      return { message: `Producto con nombre ${nombre} ya registrado` };
    return null;
  }

  // UPDATE

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const { categoriaId, ...rest } = updateProductoDto;
    const product = await this.productRepository.preload({ id, ...rest });

    if (!product)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);

    if (categoriaId) {
      const categoria = await this.categoriaRepository.findOneBy({
        id: categoriaId,
      });
      if (!categoria)
        throw new NotFoundException(
          `Categoría con id ${categoriaId} no encontrada`,
        );
      product.categoria = categoria;
    }

    if (rest.stock !== undefined && rest.status !== 'inactive') {
      if (rest.stock === 0) {
        product.status = 'out_of_stock';
      } else if (rest.stock < 5) {
        product.status = 'low_stock';
      } else {
        product.status = 'active';
      }
    }

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error: any) {
      throw this.handleExceptions(error);
    }
  }
  // DELETE

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.softDelete(product.id);
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      const detail = error.detail as string;

      if (typeof detail === 'string') {
        let field = 'general';
        let value = '';

        if (detail.includes('(nombre)')) {
          field = 'nombre';
          const startIndex = detail.indexOf('=(') + 2;
          const endIndex = detail.indexOf(')', startIndex);
          value = detail.substring(startIndex, endIndex);
        } else if (detail.includes('(slug)')) {
          field = 'slug';
          const startIndex = detail.indexOf('=(') + 2;
          const endIndex = detail.indexOf(')', startIndex);
          value = detail.substring(startIndex, endIndex);
        }

        if (field !== 'general') {
          throw new BadRequestException(
            `Ya existe un producto con el ${field} '${value}'`,
          );
        }
      }

      throw new BadRequestException('Ya existe un producto con esos datos');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error al crear el producto');
  }
}
