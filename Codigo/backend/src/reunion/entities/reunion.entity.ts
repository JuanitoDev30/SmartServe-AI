import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Prospecto } from '../../prospecto/entities/prospecto.entity';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';

export enum EstadoReunion {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  REALIZADA = 'REALIZADA',
  CANCELADA = 'CANCELADA',
}

export enum ModalidadReunion {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
}

@Entity()
export class Reunion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Prospecto, { nullable: false, eager: false })
  prospecto!: Prospecto;

  @ManyToOne(() => Proyecto, { nullable: true, eager: false })
  proyecto?: Proyecto;

  @Column('timestamp')
  fechaHora?: Date;

  @Column({
    type: 'enum',
    enum: ModalidadReunion,
    default: ModalidadReunion.PRESENCIAL,
  })
  modalidad?: ModalidadReunion;

  @Column({
    type: 'enum',
    enum: EstadoReunion,
    default: EstadoReunion.PENDIENTE,
  })
  estado?: EstadoReunion;

  @Column('text', { nullable: true })
  notas?: string;

  @CreateDateColumn()
  creadoEn?: Date;

  @UpdateDateColumn()
  actualizadoEn?: Date;
}
