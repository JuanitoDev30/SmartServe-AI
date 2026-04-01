import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class PedidoService {
  private readonly logger = new Logger(PedidoService.name);

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // CREATE
  async create(createPedidoDto: CreatePedidoDto) {
    try {
      const { productosIds, usuarioId, ...rest } = createPedidoDto;

      const productos = await this.productoRepository.find({
        where: { id: In(productosIds) },
      });

      if (productos.length === 0) {
        throw new BadRequestException('No existen productos válidos');
      }

      const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const total = productos.reduce(
        (sum, producto) => sum + producto.precio,
        0,
      );

      const pedido = this.pedidoRepository.create({
        ...rest,
        total,
        productos,
        usuario,
      });

      await this.pedidoRepository.save(pedido);

      return pedido;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET ALL
  async findAll() {
    try {
      return await this.pedidoRepository.find({
        relations: ['productos', 'usuario'],
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET ONE
  async findOne(id: string) {
    try {
      const pedido = await this.pedidoRepository.findOne({
        where: { id },
        relations: ['productos', 'usuario'],
      });

      if (!pedido) {
        throw new NotFoundException(
          `Pedido con id ${id} no encontrado`,
        );
      }

      return pedido;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // UPDATE
  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    try {
      const pedido = await this.pedidoRepository.preload({
        id,
        ...updatePedidoDto,
      });

      if (!pedido) {
        throw new NotFoundException(
          `Pedido con id ${id} no encontrado`,
        );
      }

      await this.pedidoRepository.save(pedido);

      return pedido;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // DELETE
  async remove(id: string) {
    try {
      const result = await this.pedidoRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Pedido con id ${id} no encontrado`);
      }

      return { message: 'Pedido eliminado correctamente' };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // MANEJO DE EXCEPCIONES
  private handleExceptions(error: any) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    if (error.code === '23505') {
      throw new BadRequestException('Datos duplicados');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error en el pedido');
  }
}