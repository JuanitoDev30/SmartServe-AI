import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reunion, EstadoReunion } from './entities/reunion.entity';
import { CreateReunionDto } from './dto/create-reunion.dto';
import { UpdateReunionDto } from './dto/update-reunion.dto';
import { ProspectoService } from '../prospecto/prospecto.service';
import { EstadoProspecto } from '../prospecto/entities/prospecto.entity';

@Injectable()
export class ReunionService {
  constructor(
    @InjectRepository(Reunion)
    private readonly reunionRepo: Repository<Reunion>,
    private readonly prospectoService: ProspectoService,
  ) {}

  /**
   * Punto de entrada principal desde el agente: agenda la reunión
   * y mueve al prospecto a estado REUNION_AGENDADA en una sola operación.
   */
  async agendar(dto: CreateReunionDto): Promise<Reunion> {
    // Esto valida que el prospecto exista antes de crear la reunión
    await this.prospectoService.findOne(dto.prospectoId);

    const reunion = this.reunionRepo.create({
      prospecto: { id: dto.prospectoId } as Reunion['prospecto'],
      proyecto: dto.proyectoId
        ? ({ id: dto.proyectoId } as Reunion['proyecto'])
        : undefined,
      fechaHora: new Date(dto.fechaHora),
      modalidad: dto.modalidad,
      notas: dto.notas,
    });

    const guardada = await this.reunionRepo.save(reunion);
    await this.prospectoService.cambiarEstado(
      dto.prospectoId,
      EstadoProspecto.REUNION_AGENDADA,
    );
    return guardada;
  }

  async findAll(estado?: EstadoReunion): Promise<Reunion[]> {
    return this.reunionRepo.find({
      where: estado ? { estado } : {},
      relations: ['prospecto', 'proyecto'],
      order: { fechaHora: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Reunion> {
    const reunion = await this.reunionRepo.findOne({
      where: { id },
      relations: ['prospecto', 'proyecto'],
    });
    if (!reunion) throw new NotFoundException(`Reunión ${id} no encontrada`);
    return reunion;
  }

  /**
   * Edición general (fecha, modalidad, notas, proyecto). No permite
   * cambiar el estado ni reasignar el prospecto: para eso usa
   * cambiarEstado(), que además dispara la lógica de negocio asociada.
   */
  async update(id: string, dto: UpdateReunionDto): Promise<Reunion> {
    const reunion = await this.findOne(id);

    if (dto.fechaHora) reunion.fechaHora = new Date(dto.fechaHora);
    if (dto.modalidad) reunion.modalidad = dto.modalidad;
    if (dto.notas !== undefined) reunion.notas = dto.notas;
    if (dto.proyectoId) {
      reunion.proyecto = { id: dto.proyectoId } as Reunion['proyecto'];
    }

    return this.reunionRepo.save(reunion);
  }

  async findProximas(): Promise<Reunion[]> {
    return this.reunionRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.prospecto', 'prospecto')
      .leftJoinAndSelect('r.proyecto', 'proyecto')
      .where('r.fechaHora >= :ahora', { ahora: new Date() })
      .andWhere('r.estado IN (:...estados)', {
        estados: [EstadoReunion.PENDIENTE, EstadoReunion.CONFIRMADA],
      })
      .orderBy('r.fechaHora', 'ASC')
      .getMany();
  }

  async cambiarEstado(id: string, estado: EstadoReunion): Promise<Reunion> {
    const reunion = await this.findOne(id);
    reunion.estado = estado;
    const guardada = await this.reunionRepo.save(reunion);

    // Si la reunión se realizó, consideramos al prospecto convertido
    if (estado === EstadoReunion.REALIZADA) {
      await this.prospectoService.cambiarEstado(
        reunion.prospecto.id,
        EstadoProspecto.CONVERTIDO,
      );
    }
    return guardada;
  }

  async remove(id: string): Promise<void> {
    const reunion = await this.findOne(id);
    await this.reunionRepo.remove(reunion);
  }
}
