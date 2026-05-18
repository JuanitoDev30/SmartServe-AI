import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EstadoCliente } from './enum/usuarioEstado.enum';

@Injectable()
export class ClienteService {
  private readonly logger = new Logger('ClienteService');

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  //TODO: USE TRY CATCH IN ALL METHODS
  // CREATE
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      // validar telefoo duplicado

      const existeTelefono = await this.clienteRepository.findOneBy({
        telefono: createClienteDto.telefono,
      });

      if (existeTelefono) {
        throw new BadRequestException(
          `El teléfono ${createClienteDto.telefono} ya está registrado`,
        );
      }

      //validar email duplicado
      if (createClienteDto.email) {
        const existeEmail = await this.clienteRepository.findOneBy({
          email: createClienteDto.email,
        });

        if (existeEmail) {
          throw new BadRequestException(
            `El email ${createClienteDto.email} ya está registrado`,
          );
        }
      }

      const cliente = this.clienteRepository.create(createClienteDto);
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      return this.handleExceptions(error);
    }
  }

  async findOrCreate(
    nombre: string,
    telefono: string,
    email?: string,
    direccionPrincipal?: string, // 👈
  ): Promise<{ cliente: Cliente; esNuevo: boolean }> {
    try {
      const existente = await this.clienteRepository.findOneBy({ telefono });
      if (existente) {
        // Si ya existe y ahora tiene direccion, actualizarla
        if (direccionPrincipal && !existente.direccionPrincipal) {
          existente.direccionPrincipal = direccionPrincipal;
          await this.clienteRepository.save(existente);
        }
        return { cliente: existente, esNuevo: false };
      }

      if (email) {
        const existenteEmail = await this.clienteRepository.findOneBy({
          email,
        });
        if (existenteEmail) {
          return { cliente: existenteEmail, esNuevo: false };
        }
      }

      const nuevo = this.clienteRepository.create({
        nombre,
        telefono,
        email,
        direccionPrincipal, // 👈
        estado: EstadoCliente.ACTIVO,
      });

      const clienteGuardado = await this.clienteRepository.save(nuevo);
      return { cliente: clienteGuardado, esNuevo: true };
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  // GET
  async findAll(paginationDto: PaginationDto) {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      estado,
      sortBy = 'creadoEn',
      sortOrder = 'desc',
    } = paginationDto;

    const offset = (page - 1) * pageSize;

    const query = this.clienteRepository
      .createQueryBuilder('cliente')
      .loadRelationCountAndMap('cliente.totalPedidos', 'cliente.pedidos'); // 👈

    if (search) {
      query.where(
        'cliente.nombre ILIKE :search OR cliente.telefono ILIKE :search OR cliente.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (estado) {
      query.andWhere('cliente.estado = :estado', { estado });
    }

    // sortBy de totalPedidos requiere subquery especial
    if (sortBy === 'totalPedidos') {
      query
        .addSelect(
          (subQuery) =>
            subQuery
              .select('COUNT(p.id)', 'cnt')
              .from('pedido', 'p')
              .where('p.clienteId = cliente.id'),
          'pedidos_count',
        )
        .orderBy('pedidos_count', sortOrder.toUpperCase() as 'ASC' | 'DESC');
    } else {
      query.orderBy(
        `cliente.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    query.take(pageSize).skip(offset);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // GET ONE
  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: {
        pedidos: {
          items: {
            producto: true,
          },
        },
      },

      order: {
        pedidos: {
          creadoEn: 'DESC',
        },
      },
    });

    if (!cliente) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return cliente;
  }

  async findByTelefono(telefono: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ telefono });
    if (!cliente) {
      throw new NotFoundException(
        `Cliente con teléfono ${telefono} no encontrado`,
      );
    }
    return cliente;
  }

  // UPDATE
  async update(
    id: string,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    try {
      // Validar que el nuevo teléfono no esté en uso por otro cliente
      if (updateClienteDto.telefono) {
        const existente = await this.clienteRepository.findOneBy({
          telefono: updateClienteDto.telefono,
        });
        if (existente && existente.id !== id) {
          throw new BadRequestException('El teléfono ya está en uso');
        }
      }

      const cliente = await this.clienteRepository.preload({
        id,
        ...updateClienteDto,
      });

      if (!cliente) throw new NotFoundException(`Cliente ${id} no encontrado`);

      return await this.clienteRepository.save(cliente);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // DELETE
  async desactivar(id: string): Promise<Cliente> {
    try {
      const cliente = await this.findOne(id);

      if (cliente.estado === EstadoCliente.INACTIVO) {
        throw new BadRequestException('El cliente ya está inactivo');
      }

      cliente.estado = EstadoCliente.INACTIVO;
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async getStats() {
    const [total, activos, inactivos, suspendidos] = await Promise.all([
      this.clienteRepository.count(),
      this.clienteRepository.countBy({ estado: EstadoCliente.ACTIVO }),
      this.clienteRepository.countBy({ estado: EstadoCliente.INACTIVO }),
      this.clienteRepository.countBy({ estado: EstadoCliente.SUSPENDIDO }),
    ]);

    const { count } = await this.clienteRepository
      .createQueryBuilder('cliente')
      .innerJoin('cliente.pedidos', 'pedido')
      .select('COUNT(pedido.id)', 'count')
      .getRawOne();

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const nuevosEsteMes = await this.clienteRepository
      .createQueryBuilder('cliente')
      .where('cliente.creadoEn >= :inicioMes', { inicioMes })
      .getCount();

    return {
      total,
      activos,
      inactivos,
      suspendidos,
      totalPedidos: parseInt(count) || 0,
      nuevosEsteMes,
    };
  }

  // ─── MANEJO DE ERRORES ────────────────────────────────────────────────────
  private handleExceptions(error: any): never {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    if (error.code === '23505') {
      throw new BadRequestException('Teléfono o email ya registrado');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado en clientes');
  }
}
