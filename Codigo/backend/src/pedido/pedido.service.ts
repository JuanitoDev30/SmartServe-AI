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
import { Cliente } from '../cliente/entities/cliente.entity';
import { EstadoPedido } from './enum/pedidoEstado.enum';
import { PedidoItem } from './entities/pedidoItem.entity';
import { PedidoGateway } from './pedido.gateway';

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  [EstadoPedido.PENDIENTE]: [EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO],
  [EstadoPedido.CONFIRMADO]: [
    EstadoPedido.EN_PREPARACION,
    EstadoPedido.CANCELADO,
  ],
  [EstadoPedido.EN_PREPARACION]: [EstadoPedido.EN_CAMINO],
  [EstadoPedido.EN_CAMINO]: [EstadoPedido.ENTREGADO],
  [EstadoPedido.ENTREGADO]: [],
  [EstadoPedido.CANCELADO]: [],
};

@Injectable()
export class PedidoService {
  private readonly logger = new Logger(PedidoService.name);

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(PedidoItem)
    private readonly pedidoItemRepository: Repository<PedidoItem>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    private readonly pedidoGateway: PedidoGateway,
  ) {}

  // CREATE
  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    try {
      const { items, usuarioId, direccion, notas, metodoPago } =
        createPedidoDto;

      // Validar usuario

      const usuario = await this.clienteRepository.findOneBy({ id: usuarioId });

      if (!usuario) {
        throw new NotFoundException(
          `Usuario con id ${usuarioId} no encontrado`,
        );
      }

      // Cargar productos y validar stock

      const productoIds = items.map((item) => item.productoId);

      const productos = await this.productoRepository.findBy({
        id: In(productoIds),
      });

      if (productos.length !== productoIds.length) {
        const encontrados = productos.map((p) => p.id);
        const faltantes = productoIds.filter((id) => !encontrados.includes(id));
        throw new NotFoundException(
          `Productos con ids ${faltantes.join(', ')} no encontrados`,
        );
      }

      // Construir items del pedido y calcular subtotal

      const productoMap = new Map(productos.map((p) => [p.id, p]));
      let subTotal = 0;

      const pedidoItems = items.map((item) => {
        const producto = productoMap.get(item.productoId);
        const subtotalItem = producto!.precio * item.cantidad;
        subTotal += subtotalItem;

        return this.pedidoItemRepository.create({
          producto,
          cantidad: item.cantidad,
          precioUnitario: producto!.precio,
          subtotalItem,
        });
      });

      // Crear y guardar el pedido (cascade guarda los items automaticamente)

      const pedido = this.pedidoRepository.create({
        cliente: usuario,
        items: pedidoItems,
        subTotal,
        total: subTotal, // Aquí podrías aplicar descuentos o impuestos si es necesario
        direccion,
        notas,
        metodoPago,
        estado: EstadoPedido.PENDIENTE,
      });

      const pedidoGuardado = await this.pedidoRepository.save(pedido);

      // Emitir evento WebSocket

      this.pedidoGateway.emitirNuevoPedido(pedidoGuardado);

      return pedidoGuardado;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET ALL
  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      relations: {
        cliente: true,
        items: {
          producto: true,
        },
      },
      order: { creadoEn: 'DESC' },
    });
  }

  //  GET ONE
  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: { cliente: true, items: { producto: true } },
    });

    if (!pedido) throw new NotFoundException(`Pedido ${id} no encontrado`);
    return pedido;
  }

  async findByEstado(estado: EstadoPedido): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { estado },
      relations: { cliente: true, items: { producto: true } },
      order: { creadoEn: 'DESC' },
    });
  }

  async findByCliente(usuarioId: string): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { cliente: { id: usuarioId } },
      relations: { cliente: true, items: { producto: true } },
      order: { creadoEn: 'DESC' },
    });
  }

  // UPDATE
  async update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    try {
      const pedido = await this.findOne(id);

      //validar transicion de estado si se esta cambiadno

      if (updatePedidoDto.estado && updatePedidoDto.estado !== pedido.estado) {
        const permitidos = TRANSICIONES_VALIDAS[pedido.estado];

        if (!permitidos.includes(updatePedidoDto.estado)) {
          throw new BadRequestException(
            `Transición inválida: ${pedido.estado} → ${updatePedidoDto.estado}. ` +
              `Permitidos: ${permitidos.length ? permitidos.join(', ') : 'ninguno'}`,
          );
        }
      }

      // Aplicar solo los campos que vienen en el DTO

      Object.assign(pedido, updatePedidoDto);
      const pedidoActualizado = await this.pedidoRepository.save(pedido);
      this.pedidoGateway.emitirPedidoActualizado(pedidoActualizado);
      return pedidoActualizado;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  //  DELETE
  // async remove(id: string) {
  //   try {
  //     const result = await this.pedidoRepository.delete(id);

  //     if (result.affected === 0) {
  //       throw new NotFoundException(
  //         `Pedido con id ${id} no encontrado`,
  //       );
  //     }

  //     return { message: 'Pedido eliminado correctamente' };
  //   } catch (error) {
  //     this.handleExceptions(error);
  //   }
  // }

  // MANEJO DE ERRORES
  private handleExceptions(error: any): never {
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
    throw new InternalServerErrorException('Error inesperado en pedidos');
  }
}
