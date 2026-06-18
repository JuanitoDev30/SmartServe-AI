import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BulkImportProductoDto } from './dto/bulk-import-producto.dto';
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

  async bulkCreate(file: Express.Multer.File): Promise<{
    success: number;
    errors: { fila: number; nombre: string; errores: string[] }[];
    created: Producto[];
  }> {
    //1. Parsear el Excel

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
    });

    if (!rows.length) {
      throw new BadRequestException('El archivo Excel está vacío');
    }

    const results: Producto[] = [];
    const errors: { fila: number; nombre: string; errores: string[] }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const fila = i + 2; // Fila real en el Excel (encabezado = fila 1)
      const row = rows[i];

      // 2. Mapear columnas del Excel → DTO

      const dto = plainToInstance(BulkImportProductoDto, {
        nombre: row['nombre'] || row['Nombre'] || '',
        precio: row['precio'] || row['Precio'] || 0,
        descripcion: row['descripcion'] || row['Descripción'] || undefined,
        slug: row['slug'] || row['Slug'] || undefined,
        stock: row['stock'] || row['Stock'] || 0,
        imagen: row['imagen'] || row['Imagen'] || undefined,
        proveedor: row['proveedor'] || row['Proveedor'] || undefined,
        ivaPercent: row['ivaPercent'] || row['IVA (%)'] || 19,
        categoriaNombre: row['categoria'] || row['Categoría'] || undefined,
      });

      // 3. Validar con class-validator

      const validationErrors = await validate(dto);
      if (validationErrors.length > 0) {
        errors.push({
          fila,
          nombre: dto.nombre || `Fila ${fila}`,
          errores: validationErrors.flatMap((e) =>
            Object.values(e.constraints || {}),
          ),
        });
        continue;
      }

      // 4. Verificar duplicados de nombre y slug
      const [dupNombre, dupSlug] = await Promise.all([
        this.findOneByName(dto.nombre),
        dto.slug ? this.findOneBySlug(dto.slug) : Promise.resolve(null),
      ]);

      if (dupNombre || dupSlug) {
        errors.push({
          fila,
          nombre: dto.nombre,
          errores: [
            dupNombre ? dupNombre.message : null,
            dupSlug ? dupSlug.message : null,
          ].filter(Boolean) as string[],
        });
        continue;
      }

      // 5. Buscar categoría por nombre (opcional)

      let categoria: Categoria | null = null;
      if (dto.categoriaNombre) {
        categoria = await this.categoriaRepository.findOne({
          where: { nombre: ILike(dto.categoriaNombre) },
        });
        // Si no existe la categoría no bloqueamos, simplemente queda sin categoría
      }

      // 6. Determinar slug automático si no viene

      const slug =
        dto.slug ||
        dto.nombre
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

      // 7. Calcular status según stock

      const stock = dto.stock ?? 0;
      const status =
        stock === 0 ? 'out_of_stock' : stock < 5 ? 'low_stock' : 'active';

      // 8. Crear y guardar
      try {
        const producto = this.productRepository.create({
          nombre: dto.nombre,
          precio: dto.precio,
          descripcion: dto.descripcion,
          slug,
          stock,
          imagen: dto.imagen,
          proveedor: dto.proveedor,
          ivaPercent: dto.ivaPercent ?? 19,
          status,
          ...(categoria ? { categoria } : {}),
        });

        await this.productRepository.save(producto);
        results.push(producto);
      } catch (error) {
        errors.push({
          fila,
          nombre: dto.nombre,
          errores: ['Error interno al guardar el producto'],
        });
      }
    }

    return {
      success: results.length,
      errors,
      created: results,
    };
  }
}
