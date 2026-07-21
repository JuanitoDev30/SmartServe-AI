import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto, EstadoProyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
  ) {}

  async create(dto: CreateProyectoDto): Promise<Proyecto> {
    const proyecto = this.proyectoRepo.create(dto);
    return this.proyectoRepo.save(proyecto);
  }

  async findAll(soloActivos = false): Promise<Proyecto[]> {
    if (soloActivos) {
      return this.proyectoRepo.find({
        where: { activo: true },
        order: { creadoEn: 'DESC' },
      });
    }
    return this.proyectoRepo.find({ order: { creadoEn: 'DESC' } });
  }

  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoRepo.findOne({ where: { id } });
    if (!proyecto) throw new NotFoundException(`Proyecto ${id} no encontrado`);
    return proyecto;
  }

  async findByEstado(estado: EstadoProyecto): Promise<Proyecto[]> {
    return this.proyectoRepo.find({ where: { estado, activo: true } });
  }

  async update(id: string, dto: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    Object.assign(proyecto, dto);
    return this.proyectoRepo.save(proyecto);
  }

  async desactivar(id: string): Promise<Proyecto> {
    return this.update(id, { activo: false } as UpdateProyectoDto);
  }

  async remove(id: string): Promise<void> {
    const proyecto = await this.findOne(id);
    await this.proyectoRepo.remove(proyecto);
  }

  /**
   * Usado por el agente conversacional para ofrecer proyectos
   * disponibles según lo que el cliente va contando (tipo, presupuesto).
   */
  async findParaAgente(filtros?: {
    tipo?: TipoProyectoFiltro;
    presupuestoMax?: number;
  }): Promise<Proyecto[]> {
    const qb = this.proyectoRepo
      .createQueryBuilder('p')
      .where('p.activo = :activo', { activo: true })
      .andWhere('p.estado != :agotado', { agotado: EstadoProyecto.AGOTADO });

    if (filtros?.tipo) {
      qb.andWhere('p.tipo = :tipo', { tipo: filtros.tipo });
    }
    if (filtros?.presupuestoMax) {
      qb.andWhere('p.precioDesde <= :max', { max: filtros.presupuestoMax });
    }
    return qb.orderBy('p.precioDesde', 'ASC').getMany();
  }
}

type TipoProyectoFiltro = Proyecto['tipo'];
