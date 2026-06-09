import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../pedido/entities/pedido.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Producto } from '../producto/entities/producto.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async search(q: string) {
    if (!q || q.trim().length < 2) {
      return { clientes: [], pedidos: [], productos: [] };
    }

    const term = `%${q.trim()}%`;

    const [clientes, pedidos, productos] = await Promise.all([
      // Buscar clientes
      this.clienteRepository
        .createQueryBuilder('cliente')
        .where('cliente.nombre ILIKE :term', { term })
        .orWhere('cliente.telefono ILIKE :term', { term })
        .orWhere('cliente.email ILIKE :term', { term })
        // Sin buscar por id — el admin no busca por UUID de cliente
        .select([
          'cliente.id',
          'cliente.nombre',
          'cliente.telefono',
          'cliente.email',
          'cliente.estado',
        ])
        .limit(5)
        .getMany(),

      // Buscar pedidos

      this.pedidoRepository
        .createQueryBuilder('pedido')
        .innerJoinAndSelect('pedido.cliente', 'cliente')
        .where('CAST(pedido.id AS TEXT) ILIKE :term', { term })
        .orWhere('cliente.nombre ILIKE :term', { term })
        .orWhere('pedido.direccion ILIKE :term', { term })
        .select([
          'pedido.id',
          'pedido.estado',
          'pedido.total',
          'pedido.creadoEn',
          'cliente.id',
          'cliente.nombre',
        ])
        .limit(5)
        .getMany(),

      // Buscar productos
      this.productoRepository
        .createQueryBuilder('producto')
        .where('producto.nombre ILIKE :term', { term })
        .orWhere('producto.descripcion ILIKE :term', { term })
        .orWhere('producto.slug ILIKE :term', { term })
        // Sin buscar por id
        .select([
          'producto.id',
          'producto.nombre',
          'producto.precio',
          'producto.stock',
          'producto.status',
        ])
        .limit(5)
        .getMany(),
    ]);

    return {
      clientes: clientes.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        telefono: c.telefono,
        email: c.email,
        estado: c.estado,
        tipo: 'cliente',
      })),
      pedidos: pedidos.map((p) => ({
        id: p.id,
        estado: p.estado,
        total: p.total,
        cliente: p.cliente.nombre,
        creadoEn: p.creadoEn,
        tipo: 'pedido',
      })),
      productos: productos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        stock: p.stock,
        status: p.status,
        tipo: 'producto',
      })),
    };
  }
}
