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
  ): Promise<{ cliente: Cliente; esNuevo: boolean }> {
    try {
      //Buscar primero por telefono

      const existente = await this.clienteRepository.findOneBy({ telefono });

      if (existente) {
        return { cliente: existente, esNuevo: false };
      }

      // Si tiene email, buscar tambien por email

      if (email) {
        const existenteEmail = await this.clienteRepository.findOneBy({
          email,
        });
        if (existenteEmail) {
          return { cliente: existenteEmail, esNuevo: false };
        }
      }

      // No existe : crear nuevo cliente

      const nuevo = this.clienteRepository.create({
        nombre,
        telefono,
        email,
        estado: EstadoCliente.ACTIVO,
      });

      const clienteGuardado = await this.clienteRepository.save(nuevo);

      return { cliente: clienteGuardado, esNuevo: true };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET
  async findAll(paginationDto: PaginationDto): Promise<Cliente[]> {
    const { page = 1, pageSize = 10 } = paginationDto;

    const offset = (page - 1) * pageSize;

    return this.clienteRepository.find({
      take: pageSize,
      skip: offset,
      order: {
        creadoEn: 'DESC',
      },
    });
  }

  // GET ONE
  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: { pedidos: true },
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
