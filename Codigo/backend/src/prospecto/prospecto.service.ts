import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prospecto, EstadoProspecto } from './entities/prospecto.entity';
import { CreateProspectoDto } from './dto/create-prospecto.dto';
import { UpdateProspectoDto } from './dto/update-prospecto.dto';

@Injectable()
export class ProspectoService {
  constructor(
    @InjectRepository(Prospecto)
    private readonly prospectoRepo: Repository<Prospecto>,
  ) {}

  async create(dto: CreateProspectoDto): Promise<Prospecto> {
    const existente = await this.prospectoRepo.findOne({
      where: { telefono: dto.telefono },
    });
    if (existente) {
      throw new ConflictException('Ya existe un prospecto con ese teléfono');
    }
    const prospecto = this.prospectoRepo.create(dto);
    return this.prospectoRepo.save(prospecto);
  }

  /**
   * Pensado para el agente: si el cliente ya había escrito antes,
   * lo recupera por teléfono; si es la primera vez, lo crea.
   */
  async buscarOCrear(
    telefono: string,
    datosIniciales?: Partial<CreateProspectoDto>,
  ): Promise<Prospecto> {
    let prospecto = await this.prospectoRepo.findOne({
      where: { telefono },
      relations: ['proyectoInteres'],
    });
    if (!prospecto) {
      prospecto = this.prospectoRepo.create({ telefono, ...datosIniciales });
      prospecto = await this.prospectoRepo.save(prospecto);
    }
    return prospecto;
  }

  async findAll(estado?: EstadoProspecto): Promise<Prospecto[]> {
    return this.prospectoRepo.find({
      where: estado ? { estado } : {},
      relations: ['proyectoInteres'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Prospecto> {
    const prospecto = await this.prospectoRepo.findOne({
      where: { id },
      relations: ['proyectoInteres'],
    });
    if (!prospecto)
      throw new NotFoundException(`Prospecto ${id} no encontrado`);
    return prospecto;
  }

  async update(id: string, dto: UpdateProspectoDto): Promise<Prospecto> {
    const prospecto = await this.findOne(id);
    Object.assign(prospecto, dto);
    return this.prospectoRepo.save(prospecto);
  }

  async cambiarEstado(id: string, estado: EstadoProspecto): Promise<Prospecto> {
    return this.update(id, { estado } as UpdateProspectoDto);
  }

  async asignarProyectoInteres(
    id: string,
    proyectoId: string,
  ): Promise<Prospecto> {
    const prospecto = await this.findOne(id);
    prospecto.proyectoInteres = {
      id: proyectoId,
    } as Prospecto['proyectoInteres'];
    return this.prospectoRepo.save(prospecto);
  }

  async remove(id: string): Promise<void> {
    const prospecto = await this.findOne(id);
    await this.prospectoRepo.remove(prospecto);
  }
}
