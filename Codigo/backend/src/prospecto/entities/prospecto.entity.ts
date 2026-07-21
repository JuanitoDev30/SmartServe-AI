import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';

export enum EstadoProspecto {
  NUEVO = 'NUEVO',
  CONTACTADO = 'CONTACTADO',
  REUNION_AGENDADA = 'REUNION_AGENDADA',
  CONVERTIDO = 'CONVERTIDO',
  DESCARTADO = 'DESCARTADO',
}

export enum PresupuestoRango {
  MENOS_200M = 'MENOS_200M',
  ENTRE_200_400M = 'ENTRE_200_400M',
  ENTRE_400_600M = 'ENTRE_400_600M',
  ENTRE_600M_1B = 'ENTRE_600M_1B',
  MAS_1B = 'MAS_1B',
}

@Entity()
export class Prospecto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  nombre!: string;

  @Column('text', { unique: true })
  telefono!: string;

  @Column('text', { nullable: true, unique: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: EstadoProspecto,
    default: EstadoProspecto.NUEVO,
  })
  estado!: EstadoProspecto;

  @Column({ type: 'enum', enum: PresupuestoRango, nullable: true })
  presupuesto?: PresupuestoRango;

  @ManyToOne(() => Proyecto, { nullable: true, eager: false })
  proyectoInteres?: Proyecto;

  @Column('text', { nullable: true })
  notas?: string;

  @CreateDateColumn()
  creadoEn?: Date;

  @UpdateDateColumn()
  actualizadoEn?: Date;
}
