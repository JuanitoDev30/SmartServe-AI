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

        if (!producto) {
          throw new NotFoundException(
            `Producto ${item.productoId} no encontrado`,
          );
        }

        // VALIDAR STOCK
        if ((producto.stock ?? 0) < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${producto.nombre}`,
          );
        }

        const subtotalItem = producto.precio * item.cantidad;

        subTotal += subtotalItem;

        return this.pedidoItemRepository.create({
          producto,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          subtotalItem,
        });
      });

      // Crear y guardar el pedido (cascade guarda los items automaticamente)

      const pedido = this.pedidoRepository.create({
        cliente: usuario,
        items: pedidoItems,
        subTotal,
        total: subTotal,
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

      if (updatePedidoDto.estado && updatePedidoDto.estado !== pedido.estado) {
        const permitidos = TRANSICIONES_VALIDAS[pedido.estado];

        if (!permitidos.includes(updatePedidoDto.estado)) {
          throw new BadRequestException(
            `Transición inválida: ${pedido.estado} → ${updatePedidoDto.estado}`,
          );
        }

        // descontar stock al confirmar
        if (
          pedido.estado === EstadoPedido.PENDIENTE &&
          updatePedidoDto.estado === EstadoPedido.CONFIRMADO
        ) {
          await this.descontarStockPedido(pedido);
        }

        // devolver stock al cancelar
        if (
          pedido.estado !== EstadoPedido.CANCELADO &&
          updatePedidoDto.estado === EstadoPedido.CANCELADO
        ) {
          await this.devolverStockPedido(pedido);
        }
      }

      if (updatePedidoDto.cliente) {
        const clienteActual = await this.clienteRepository.findOneBy({
          id: pedido.cliente.id,
        });
        if (!clienteActual)
          throw new NotFoundException('Cliente no encontrado');
        Object.assign(clienteActual, updatePedidoDto.cliente);
        await this.clienteRepository.save(clienteActual);
      }

      const { cliente, ...camposPlanos } = updatePedidoDto;
      Object.assign(pedido, camposPlanos);
      await this.pedidoRepository.save(pedido);

      const pedidoCompleto = await this.findOne(id);
      this.pedidoGateway.emitirPedidoActualizado(pedidoCompleto);
      return pedidoCompleto;
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

  private async descontarStockPedido(pedido: Pedido) {
    for (const item of pedido.items) {
      const producto = await this.productoRepository.findOne({
        where: { id: item.producto.id },
      });

      if (!producto) {
        throw new NotFoundException(
          `Producto ${item.producto.id} no encontrado`,
        );
      }

      const stockActual = producto.stock ?? 0;

      if (stockActual < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${producto.nombre}. Disponible: ${stockActual}`,
        );
      }

      producto.stock = stockActual - item.cantidad;

      // actualizar status automáticamente
      if (producto.stock === 0) {
        producto.status = 'out_of_stock';
      } else if (producto.stock <= 5) {
        producto.status = 'low_stock';
      } else {
        producto.status = 'active';
      }

      await this.productoRepository.save(producto);
    }
  }

  private async devolverStockPedido(pedido: Pedido) {
    for (const item of pedido.items) {
      const producto = await this.productoRepository.findOne({
        where: { id: item.producto.id },
      });

      if (!producto) continue;

      producto.stock = (producto.stock ?? 0) + item.cantidad;

      // restaurar estado
      if ((producto.stock ?? 0) > 5) {
        producto.status = 'active';
      } else if ((producto.stock ?? 0) > 0) {
        producto.status = 'low_stock';
      }

      await this.productoRepository.save(producto);
    }
  }
}
