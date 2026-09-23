import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';
import { Mesa } from './entities/mesa.entity';

@Injectable()
export class MesaService {
  private readonly logger = new Logger(MesaService.name);

  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  // CREATE
  async create(createMesaDto: CreateMesaDto): Promise<Mesa> {
    try {
      const existeNumero = await this.mesaRepository.findOneBy({
        numero: createMesaDto.numero,
      });

      if (existeNumero) {
        throw new BadRequestException(
          `Ya existe la mesa número ${createMesaDto.numero}`,
        );
      }

      const mesa = this.mesaRepository.create(createMesaDto);
      return await this.mesaRepository.save(mesa);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // GET ALL
  async findAll(soloActivas?: boolean): Promise<Mesa[]> {
    return this.mesaRepository.find({
      where: soloActivas ? { activa: true } : {},
      order: { numero: 'ASC' },
    });
  }

  // GET ONE
  async findOne(id: string): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOneBy({ id });
    if (!mesa) throw new NotFoundException(`Mesa ${id} no encontrada`);
    return mesa;
  }

  // UPDATE
  async update(id: string, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    try {
      const mesa = await this.findOne(id);

      if (updateMesaDto.numero && updateMesaDto.numero !== mesa.numero) {
        const existeNumero = await this.mesaRepository.findOneBy({
          numero: updateMesaDto.numero,
        });
        if (existeNumero) {
          throw new BadRequestException(
            `Ya existe la mesa número ${updateMesaDto.numero}`,
          );
        }
      }

      Object.assign(mesa, updateMesaDto);
      return await this.mesaRepository.save(mesa);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // DELETE — solo si la mesa nunca se usó; si no, se desactiva
  async remove(id: string): Promise<{ mensaje: string }> {
    const mesa = await this.mesaRepository.findOne({
      where: { id },
      relations: { reservas: true },
    });

    if (!mesa) throw new NotFoundException(`Mesa ${id} no encontrada`);

    if (mesa.reservas.length > 0) {
      throw new BadRequestException(
        `La mesa ${mesa.numero} tiene reservas asociadas: desactívala en lugar de eliminarla`,
      );
    }

    await this.mesaRepository.remove(mesa);
    return { mensaje: `Mesa ${mesa.numero} eliminada` };
  }

  // LAYOUT — el editor del plano guarda todas las mesas movidas de un golpe
  async actualizarLayout(dto: UpdateLayoutDto): Promise<Mesa[]> {
    const ids = dto.mesas.map((item) => item.id);

    const mesas = await this.mesaRepository.findBy({ id: In(ids) });
    const porId = new Map(mesas.map((mesa) => [mesa.id, mesa]));

    const faltantes = ids.filter((id) => !porId.has(id));
    if (faltantes.length > 0) {
      throw new NotFoundException(
        `No se encontraron las mesas: ${faltantes.join(', ')}`,
      );
    }

    for (const item of dto.mesas) {
      const mesa = porId.get(item.id)!;
      mesa.posX = item.posX;
      mesa.posY = item.posY;
      if (item.forma !== undefined) mesa.forma = item.forma;
      if (item.ancho !== undefined) mesa.ancho = item.ancho;
      if (item.alto !== undefined) mesa.alto = item.alto;
      if (item.rotacion !== undefined) mesa.rotacion = item.rotacion;
    }

    await this.mesaRepository.save([...porId.values()]);
    return this.findAll();
  }

  async cambiarDisponibilidad(id: string, activa: boolean): Promise<Mesa> {
    const mesa = await this.findOne(id);
    mesa.activa = activa;
    return this.mesaRepository.save(mesa);
  }

  async getStats() {
    const mesas = await this.mesaRepository.find();
    const activas = mesas.filter((mesa) => mesa.activa);

    return {
      total: mesas.length,
      activas: activas.length,
      inactivas: mesas.length - activas.length,
      capacidadTotal: activas.reduce((sum, mesa) => sum + mesa.capacidad, 0),
    };
  }

  // MANEJO DE ERRORES
  private handleExceptions(error: any): never {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    if (error.code === '23505') {
      throw new BadRequestException('Ya existe una mesa con ese número');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado en mesas');
  }
}
