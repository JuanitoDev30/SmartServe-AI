import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ZonaMesa } from '../enum/zonaMesa.enum';
import { Reserva } from 'src/reserva/entities/reserva.entity';

@Entity()
export class Mesa {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('int', { unique: true })
  numero!: number;

  @Column('int')
  capacidad!: number;

  @Column({ type: 'enum', enum: ZonaMesa, default: ZonaMesa.INTERIOR })
  zona!: ZonaMesa;

  // Una mesa inactiva sigue existiendo (y conserva su historial) pero no
  // se puede reservar: se usa en lugar de borrarla.
  @Index()
  @Column('bool', { default: true })
  activa!: boolean;

  @Column('text', { nullable: true })
  descripcion?: string;

  @OneToMany(() => Reserva, (reserva) => reserva.mesa)
  reservas!: Reserva[];

  @CreateDateColumn({ type: 'timestamptz' })
  creadoEn!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizadoEn!: Date;
}
