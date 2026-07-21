import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum TipoProyecto {
  APARTAMENTO = 'APARTAMENTO',
  CASA = 'CASA',
  LOTE = 'LOTE',
  LOCAL_COMERCIAL = 'LOCAL_COMERCIAL',
}

export enum EstadoProyecto {
  EN_PLANOS = 'EN_PLANOS',
  EN_CONSTRUCCION = 'EN_CONSTRUCCION',
  ENTREGADO = 'ENTREGADO',
  AGOTADO = 'AGOTADO',
}

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  nombre!: string;

  @Column({ type: 'enum', enum: TipoProyecto })
  tipo!: TipoProyecto;

  @Column('text')
  ubicacion!: string;

  @Column('text', { nullable: true })
  barrio?: string;

  @Column('decimal', { precision: 12, scale: 2 })
  precioDesde!: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  areaM2?: number;

  @Column('int', { nullable: true })
  habitaciones?: number;

  @Column('int', { nullable: true })
  banos?: number;

  @Column({
    type: 'enum',
    enum: EstadoProyecto,
    default: EstadoProyecto.EN_PLANOS,
  })
  estado!: EstadoProyecto;

  @Column('text', { nullable: true })
  descripcion?: string;

  @Column('text', { nullable: true })
  imagen?: string;

  @Column('boolean', { default: true })
  activo?: boolean;

  @CreateDateColumn()
  creadoEn?: Date;

  @UpdateDateColumn()
  actualizadoEn?: Date;
}
